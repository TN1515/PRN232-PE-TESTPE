using backend.DTOs;

namespace backend.Services;

public interface IPostService
{
    Task<IEnumerable<PostDto>> GetAllPostsAsync();
    Task<PostDto?> GetPostByIdAsync(Guid id);
    Task<PostDto> CreatePostAsync(CreatePostDto createPostDto);
    Task<PostDto?> UpdatePostAsync(Guid id, UpdatePostDto updatePostDto);
    Task<bool> DeletePostAsync(Guid id);
}
