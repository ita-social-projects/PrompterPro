using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Web;
using System.Web.Mvc;
using System.Web.Security;
using Microsoft.AspNet.SignalR;
using SoftServe.ITA.PrompterPro.WebApplication.WebHelper.Parser;
using SoftServe.ITA.PrompterPro.WebApplication.WebHelper.RefreshPrompter;

namespace SoftServe.ITA.PrompterPro.WebApplication.Hubs
{
	public class BroadcastHub : Hub
	{
		private static readonly ConcurrentDictionary<int, UserInfo> IdDictionary
			= new ConcurrentDictionary<int, UserInfo>();
		private static readonly ConcurrentDictionary<string, UserInfo> ConnectionDictionary
			= new ConcurrentDictionary<string, UserInfo>();

		private const string OperatorRoleName = "Operator";
		private const string PrompterRoleName = "Prompter";

		private const string On = "On";
		private const string Off = "Off";
		private const string Busy = "Busy";

		private static ICookieParser _cookieParser;
		
		public BroadcastHub()
		{
		    if (_cookieParser == null
				&& HttpContext.Current != null)
			{
				_cookieParser = DependencyResolver.Current
					.GetService<ICookieParser>();
			}
		}

		public void LogOn()
		{
		    if (HttpContext.Current == null)
		    {
		        return;
		    }

			var identity = (FormsIdentity)HttpContext.Current.User.Identity;

			var id = _cookieParser.GetUserId(identity);
			var role = _cookieParser.GetUserRoleName(identity);
			var connection = Context.ConnectionId;

			var userInfo = new UserInfo
			{
				Id = id,
				Role = role,
				Connection = connection
			};
			IdDictionary[id] = userInfo;
			ConnectionDictionary[connection] = userInfo;

			if (role == PrompterRoleName)
			{
				PrompterStatus.ChangeStatus(id, On);
			}
		}

		public void LogOff()
		{
			var connection = Context.ConnectionId;
			UserInfo userInfo;
			if (!ConnectionDictionary.TryGetValue(connection, out userInfo))
			{
				return;
			}

			CheckBroadcast(userInfo);
			userInfo.Connection = null;
			ConnectionDictionary.TryRemove(connection, out userInfo);
		    PrompterStatus.ChangeStatus(userInfo.Id, Off);

            
		}
		
		public override Task OnConnected()
		{
			LogOn();
			return base.OnConnected();
		}

		public override Task OnDisconnected(bool stopCalled)
		{
			LogOff();
			return base.OnDisconnected(stopCalled);
		}

		public override Task OnReconnected()
		{
			LogOff();
			LogOn();
			return base.OnReconnected();
		}


		private void CheckBroadcast(UserInfo userInfo)
		{
			var isBroadcasting =
				userInfo != null
				&& userInfo.Group != null;

			if (!isBroadcasting)
			{
				return;
			}

			if (userInfo.Role == OperatorRoleName)
			{
				ErrorEndBroadcast();
			}
			else if (userInfo.Role == PrompterRoleName)
			{
				PrompterBroadcastFailed(userInfo);
			}
		}

		private void PrompterBroadcastFailed(UserInfo userInfo)
		{
			var group = userInfo.Group;
			var operatorId = group.OperatorId;
			var operatorInfo = IdDictionary[operatorId];
			var groupName = operatorId.ToString();

			Clients.Client(operatorInfo.Connection)
				.prompterDisconnected(userInfo.Id);
			
			group.PrompterIdList.Remove(userInfo.Id);

			userInfo.Group = null;
			Groups.Remove(userInfo.Connection, groupName);

			if (group.PrompterIdList.Count == 0)
			{
				operatorInfo.Group = null;
				Groups.Remove(operatorInfo.Connection, groupName);
			}
		}

		private static bool VerifyOnOperator(int operatorId)
		{
			UserInfo userInfo;
			return IdDictionary.TryGetValue(operatorId, out userInfo)
				   && userInfo.Role == OperatorRoleName
				   && userInfo.Group == null;
		}

		private static bool VerifyBusyOperator(int operatorId)
		{
			UserInfo userInfo;
			return IdDictionary.TryGetValue(operatorId, out userInfo)
				   && userInfo.Role == OperatorRoleName
				   && userInfo.Group != null
				   && userInfo.Group.OperatorId == operatorId;
		}

		private static bool VerifyOnPrompters(List<int> promterIdList)
		{
			var isValidList =
				promterIdList != null
				&& promterIdList.Count != 0;

			if (!isValidList)
			{
				return false;
			}

			foreach (var id in promterIdList)
			{
				UserInfo userInfo;
				var isValidPrompter =
					IdDictionary.TryGetValue(id, out userInfo)
					&& userInfo.Role == PrompterRoleName
					&& userInfo.Group == null;

				if (!isValidPrompter)
				{
					return false;
				}
			}
			return true;
		}

		private static bool VerifyBusyPrompters(int operatorId, List<int> promterIdList)
		{
			var isValidList =
				promterIdList != null
				&& promterIdList.Count != 0;

			if (!isValidList)
			{
				return false;
			}

			foreach (var id in promterIdList)
			{
				UserInfo userInfo;
				var isValidPrompter =
					IdDictionary.TryGetValue(id, out userInfo)
					&& userInfo.Role == PrompterRoleName
					&& userInfo.Group != null
					&& userInfo.Group.OperatorId == operatorId;

				if (!isValidPrompter)
				{
					return false;
				}
			}
			return true;
		}

		public void StartBroadcast(BroadcastInfo info)
		{
			var id = ConnectionDictionary[Context.ConnectionId].Id;

			var canBroadcast =
				info != null
				&& VerifyOnOperator(id)
				&& VerifyOnPrompters(info.PrompterIdList);

			if (!canBroadcast)
			{
				Clients.Caller.cantStartBroadcast();
				return;
			}

			var groupName = id.ToString();
			var groupInfo = new GroupInfo
			{
				OperatorId = id,
				PrompterIdList = info.PrompterIdList
			};

			Groups.Add(Context.ConnectionId, groupName);
			IdDictionary[id].Group = groupInfo;

			foreach (var prompterId in info.PrompterIdList)
			{
				var userInfo = IdDictionary[prompterId];
				Groups.Add(userInfo.Connection, groupName);
				userInfo.Group = groupInfo;
				Clients.Client(userInfo.Connection).fetchScript(info.ScriptId, id);
			}
		}

		private void EndBroadcast(bool withError)
		{
			var connection = Context.ConnectionId;
			var operatorInfo = ConnectionDictionary[connection];
			var id = operatorInfo.Id;
			
			var canBroadcast =
				VerifyBusyOperator(id)
				&& VerifyBusyPrompters(id, operatorInfo.Group.PrompterIdList);

			if (!canBroadcast)
			{
				return;
			}

			var idList = operatorInfo.Group.PrompterIdList;
			var groupName = id.ToString();

			Groups.Remove(connection, groupName);
			operatorInfo.Group = null;

			foreach (var prompterId in idList)
			{
				var userInfo = IdDictionary[prompterId];

				Groups.Remove(userInfo.Connection, groupName);
				userInfo.Group = null;
                PrompterStatus.ChangeStatus(prompterId, On);
				if (withError)
				{
					Clients.Client(userInfo.Connection).operatorDisconnected();
				}
				else
				{
					Clients.Client(userInfo.Connection).broadcastEnd();
				}
			}
		}

		public void ErrorEndBroadcast()
		{
			EndBroadcast(true);
		}

		public void SuccessEndBroadcast()
		{
			EndBroadcast(false);
		}

		public void FetchSuccess(int operatorId)
		{
			var id = ConnectionDictionary[Context.ConnectionId].Id;
            PrompterStatus.ChangeStatus(id, Busy);

			var operatorInfo = IdDictionary[operatorId];
			Clients.Client(operatorInfo.Connection).prompterConnected(id);
		}

		public void FetchError(int operatorId)
		{
			var operatorInfo = IdDictionary[operatorId];
			Clients.Client(operatorInfo.Connection).cantStartBroadcast();
		}

		public void OperatorConnected()
		{
			var id = ConnectionDictionary[Context.ConnectionId].Id;
			var groupName = id.ToString();
			Clients.OthersInGroup(groupName).operatorConnected();
		}

	    private string GetGroupName()
	    {
	        return ConnectionDictionary[Context.ConnectionId].Id.ToString();
	    }

		public void Play()
		{
		    Clients.OthersInGroup(GetGroupName()).play();
		}

		public void Pause()
		{
		    Clients.OthersInGroup(GetGroupName()).pause();
		}

		public void Stop()
		{
		    Clients.OthersInGroup(GetGroupName()).stop();
		}

		public void ChangeTextSize(int size)
		{
		    Clients.OthersInGroup(GetGroupName()).changeTextSize(size);
		}

		public void SpeedUp()
		{
		    Clients.OthersInGroup(GetGroupName()).speedUp();
		}

		public void SpeedDown()
		{
		    Clients.OthersInGroup(GetGroupName()).speedDown();
		}

		public void MirrorText(bool? isMirroredX, bool? isMirroredY)
		{
		    Clients.OthersInGroup(GetGroupName()).mirrorText(isMirroredX, isMirroredY);
		}

		public void HandPlay()
		{
		    Clients.OthersInGroup(GetGroupName()).handPlay();
		}

		public void HandPlayBack()
		{
		    Clients.OthersInGroup(GetGroupName()).handPlayBack();
		}

	    public void PadRight(int percentage)
	    {
	        Clients.OthersInGroup(GetGroupName()).padRight(percentage);
	    }

	    public void PadLeft(int percentage)
	    {
	        Clients.OthersInGroup(GetGroupName()).padLeft(percentage);
	    }

        public void ConfigurePrompters(List<PrompterInfo> promptersConfig)
        {
            if (promptersConfig == null)
            {
                throw new ArgumentNullException("promptersConfig");
            }
            
            foreach (var prompter in promptersConfig)
            {
                UserInfo user;
                if (!IdDictionary.TryGetValue(prompter.PrompterId, out user)
                    || user == null)
                {
                    continue;
                }
                var connection = user.Connection;
                Clients.Client(connection)
                    .mirrorText(prompter.IsMirroredX, prompter.IsMirroredY);
                Clients.Client(connection).setResolution(prompter.Resolution);
            }
        }

	}
}