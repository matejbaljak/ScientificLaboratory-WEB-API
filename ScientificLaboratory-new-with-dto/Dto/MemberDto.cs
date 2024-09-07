namespace ScientificLaboratory_new_with_dto.Dto
{
    public class MemberDto
    {
        public int Id { get; set; } // Add this property to hold the actual database ID
        public string Name { get; set; }
        public string Position { get; set; }
    }
}
