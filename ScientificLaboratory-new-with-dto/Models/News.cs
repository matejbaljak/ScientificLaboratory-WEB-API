using System;
using System.ComponentModel.DataAnnotations;

namespace ScientificLaboratory_new_with_dto.Models
{
    public class News
    {
        public int Id { get; set; }

        [Required]
        [StringLength(100, MinimumLength = 5)]
        public string Title { get; set; }

        [Required]
        [StringLength(20000, MinimumLength = 10)]
        public string Content { get; set; }

        [Required]
        [StringLength(100, MinimumLength = 3)]
        public string Author { get; set; }

        [Required]
        public DateTime PublishedDate { get; set; } = DateTime.UtcNow;

        [Required]
        public string URL { get; set; }
    }
}
