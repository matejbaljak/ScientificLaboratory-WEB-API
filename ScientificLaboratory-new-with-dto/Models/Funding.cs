using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using ScientificLaboratory.Models;

namespace ScientificLaboratory_new_with_dto.Models
{
    public class Funding
    {
        [Key]
        public int FundingId { get; set; }

        [Required]
        public string Source { get; set; }

        public string SponsorName { get; set; }

        [NotMapped]
        public decimal TotalAmount
        {
            get
            {
                return FundingbyYears?.Sum(f => f.Amount) ?? 0;
            }
        }
        public List<FundingByYear> FundingbyYears { get; set; }

        // Foreign key for Project
        public int ProjectId { get; set; }

        [ForeignKey("ProjectId")]
        public Project Project { get; set; }
    }
}
