using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace ScientificLaboratory_new_with_dto.Models
{
    public class Publication

    {
        [Key]
        public int Id { get; set; }

        [Required]
        [StringLength(255)]
        public string Title { get; set; }

        [Required]
        public string Abstract { get; set; }


        [Range(1800, 2100)]
        public int Year { get; set; }

        [Required]
        [StringLength(20)] // Adjust the length as needed
        public string Pages { get; set; }

        public string ISSN { get; set; }

        public string DOI { get; set; }

        public string Type { get; set; }
        [Required]
        public int PdfId { get; set; }

        public Pdf Pdf { get; set; }

        public List<PublicationAuthor> PublicationAuthors { get; set; } = new List<PublicationAuthor>();

        public List<string> Keywords { get; set; } = new List<string>();

    }

}
