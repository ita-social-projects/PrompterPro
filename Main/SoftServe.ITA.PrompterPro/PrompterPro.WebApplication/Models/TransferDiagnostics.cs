using System;
using System.Data.Entity;
using SoftServe.ITA.PrompterPro.Domain.Models;

namespace SoftServe.ITA.PrompterPro.WebApplication.Models
{
    public class TransferDiagnostics : IStateModel
    {
        public int DiagnosticsId { get; set; }
        public int UserId { get; set; }
        public string ExceptionName { get; set; }
        public string Message { get; set; }
        public DateTime Date { get; set; }
        public EntityState EntityState { get; set; }

    }
}