using System.ComponentModel.DataAnnotations;

namespace SoftServe.ITA.PrompterPro.Domain.Models
{
    public class User : BaseModel
    {
        public int UserId { get; set; }

        [Required(ErrorMessage = "Login is required")]
        [MinLength(3,ErrorMessage = "Login must be at least 3 letters")]
        [Display(Name = "Login: ")]
        public string Login { get; set; }

        [Required(ErrorMessage = "Password is required")]
        [DataType(DataType.Password)]
        [MinLength(3, ErrorMessage = "Password must be at least 3 letters")]
        [Display(Name = "Password: ")]
        public string Password { get; set; }

        public bool Disabled { get; set; }
        public string PrompterStatus { get; set; }
        public int RoleId { get; set; }

        public Role Role { get; set; }       
    }
}
