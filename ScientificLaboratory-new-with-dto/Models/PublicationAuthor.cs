using System.ComponentModel.DataAnnotations;

namespace ScientificLaboratory_new_with_dto.Models
{
    public class PublicationAuthor
    {
        [Required]
        public int PublicationId { get; set; }

        public Publication Publication { get; set; }

        [Required]
        public int AuthorId { get; set; }

        public Author Author { get; set; }
    }
}
