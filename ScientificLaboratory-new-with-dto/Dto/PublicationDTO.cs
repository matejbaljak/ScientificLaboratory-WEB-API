using System.ComponentModel.DataAnnotations;

namespace ScientificLaboratory_new_with_dto.DTOs
{
    public class PublicationCreateUpdateDTO
    {
        [Required]
        [StringLength(255)]
        public string Title { get; set; }

        [Required]
        public string Abstract { get; set; }

        public string Type { get; set; }


        [Range(1800, 2100)]
        public int Year { get; set; }

        [Required]
        [StringLength(20)] // Adjust the length as needed
        public string Pages { get; set; }

        public string ISSN { get; set; }

        public string DOI { get; set; }




        public List<AuthorCreateUpdateDTO> Authors { get; set; } = new List<AuthorCreateUpdateDTO>();

        public List<string> Keywords { get; set; } = new List<string>();
    }

    public class AuthorCreateUpdateDTO
    {
        [Required]
        [StringLength(255)]
        public string Name { get; set; }

        [StringLength(255)]
        public string? Institution { get; set; }
    }

    public class PdfCreateUpdateDTO
    {
        [StringLength(255)]
        public string? FileName { get; set; }

        [Required]
        public byte[] Content { get; set; }
    }
}



public class PublicationDetailDTO
{
    public string Title { get; set; }
    public string Abstract { get; set; }
    public int Year { get; set; }
    public string Pages { get; set; }
    public string ISSN { get; set; }
    public string DOI { get; set; }
    public string Type { get; set; }

    public string PdfBase64 { get; set; }  // Add PdfBase64 property for Base64-encoded PDF content
    public List<AuthorDetailDTO> Authors { get; set; } = new List<AuthorDetailDTO>();
    public List<string> Keywords { get; set; } = new List<string>();
}

public class AuthorDetailDTO
{
    public string Name { get; set; }
    public string Institution { get; set; }
}
