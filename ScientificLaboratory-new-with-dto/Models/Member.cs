using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace ScientificLaboratory_new_with_dto.Models
{
    [JsonConverter(typeof(JsonStringEnumConverter))]

    public enum Position
    {
        LaboratoryManager,
        Researcher,
        ExternalAssociate
    }

    public class Member
    {
        public int Id { get; set; }  // Primary key for the database

        [Required]
        [StringLength(100)]
        public string Name { get; set; }  // Member's name

        [Required]
        public Position Position { get; set; }
    }
}
