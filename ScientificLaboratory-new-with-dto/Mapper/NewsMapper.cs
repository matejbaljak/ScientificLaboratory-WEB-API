using ScientificLaboratory_new_with_dto.Models;
using ScientificLaboratory_new_with_dto.Dto;
using static ScientificLaboratory_new_with_dto.Dto.NewsDto;

namespace ScientificLaboratory_new_with_dto.Mappers
{
    public static class NewsMapper
    {
        public static News ToNews(this NewsCreateDto dto)
        {
            return new News
            {
                Title = dto.Title,
                Content = dto.Content,
                Author = dto.Author,
                URL = dto.URL,
                PublishedDate = DateTime.UtcNow
            };
        }

        public static News ToNews(this NewsUpdateDto dto, News existingNews)
        {
            existingNews.Title = dto.Title;
            existingNews.Content = dto.Content;
            existingNews.Author = dto.Author;
            existingNews.URL = dto.URL;
            return existingNews;
        }

        public static NewsCreateDto ToNewsCreateDto(this News news)
        {
            return new NewsCreateDto
            {
                Title = news.Title,
                Content = news.Content,
                Author = news.Author,
                URL = news.URL
            };
        }

        public static NewsUpdateDto ToNewsUpdateDto(this News news)
        {
            return new NewsUpdateDto
            {
                Title = news.Title,
                Content = news.Content,
                Author = news.Author,
                URL = news.URL
            };
        }
    }
}
