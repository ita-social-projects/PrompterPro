using System;

namespace SoftServe.ITA.PrompterPro.Common
{
    public interface IEvents
    {
        event EventHandler OnPrompterChange;
        void RaiseOnPrompterChange(Object sender);
    }
    public class Events:IEvents
    {

        public event EventHandler OnPrompterChange;

        public void RaiseOnPrompterChange(Object sender)
        {
            if (OnPrompterChange != null)
            {
                OnPrompterChange(sender, EventArgs.Empty);
            }
        }
    }
}
