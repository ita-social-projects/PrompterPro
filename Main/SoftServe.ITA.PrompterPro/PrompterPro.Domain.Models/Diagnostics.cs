using System;

namespace SoftServe.ITA.PrompterPro.Domain.Models
{
    public class Diagnostics : BaseModel
    {
        public int DiagnosticsId { get; set; }
        public int UserId { get; set; }
        public string ExceptionName { get; set; }
        public string Message { get; set; }
        public DateTime Date { get; set; }
    }
}
