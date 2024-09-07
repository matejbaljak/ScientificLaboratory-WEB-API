using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace ScientificLaboratory_new_with_dto.Models
{
    public class FundingByYear
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public int Year { get; set; }

        [Column(TypeName = "decimal(18,2)")]
        public decimal Amount { get; set; }


        [ForeignKey("Funding")]
        public int FundingId { get; set; }

        public Funding Funding { get; set; }
    }
}
