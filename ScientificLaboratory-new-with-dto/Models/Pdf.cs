using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace ScientificLaboratory_new_with_dto.Models
{
    public class Pdf
    {
        [Key]
        public int Id { get; set; }

        [StringLength(255)]
        public string? FileName { get; set; }

        [Required]
        public byte[] Content { get; set; }

        [Required]
        [ForeignKey("PublicationId")]
        public Publication Publication { get; set; }

        public int PublicationId { get; set; }
    }
}
