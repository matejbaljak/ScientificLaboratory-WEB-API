using System.ComponentModel.DataAnnotations;

namespace ScientificLaboratory_new_with_dto.Models
{
    public class Author
    {
        [Key]
        public int AuthorId { get; set; }

        [Required]
        [StringLength(255)]
        public string Name { get; set; }

        [StringLength(255)]
        public string? Institution { get; set; }

        public List<PublicationAuthor> PublicationAuthors { get; set; }
    }
}
