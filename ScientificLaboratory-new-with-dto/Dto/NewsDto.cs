namespace ScientificLaboratory_new_with_dto.Dto
{
    public class NewsDto
    {
        public class NewsCreateDto
        {
            public string Title { get; set; }
            public string Content { get; set; }
            public string Author { get; set; }
            public string URL { get; set; }

        }

        public class NewsUpdateDto
        {
            public string Title { get; set; }
            public string Content { get; set; }
            public string Author { get; set; }
            public string URL { get; set; }

        }
    }
}
