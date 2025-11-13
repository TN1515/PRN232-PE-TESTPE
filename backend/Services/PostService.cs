using backend.Data;
using backend.DTOs;
using backend.Models;
using Microsoft.EntityFrameworkCore;

namespace backend.Services;

public class PostService : IPostService
{
    private readonly ApplicationDbContext _context;

    public PostService(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<PostDto>> GetAllPostsAsync()
    {
        var posts = await _context.Posts
            .OrderByDescending(p => p.CreatedAt)
            .ToListAsync();

        return posts.Select(p => MapToDto(p));
    }

    public async Task<PostDto?> GetPostByIdAsync(Guid id)
    {
        var post = await _context.Posts.FindAsync(id);
        
        if (post == null)
            return null;

        return MapToDto(post);
    }

    public async Task<PostDto> CreatePostAsync(CreatePostDto createPostDto)
    {
        var post = new Post
        {
            Id = Guid.NewGuid(),
            Name = createPostDto.Name,
            Description = createPostDto.Description,
            Image = createPostDto.Image,
            CreatedAt = DateTime.Now,
            UpdatedAt = DateTime.Now
        };

        _context.Posts.Add(post);
        await _context.SaveChangesAsync();

        return MapToDto(post);
    }

    public async Task<PostDto?> UpdatePostAsync(Guid id, UpdatePostDto updatePostDto)
    {
        var post = await _context.Posts.FindAsync(id);
        
        if (post == null)
            return null;

        post.Name = updatePostDto.Name;
        post.Description = updatePostDto.Description;
        post.Image = updatePostDto.Image;
        post.UpdatedAt = DateTime.Now;

        _context.Posts.Update(post);
        await _context.SaveChangesAsync();

        return MapToDto(post);
    }

    public async Task<bool> DeletePostAsync(Guid id)
    {
        var post = await _context.Posts.FindAsync(id);
        
        if (post == null)
            return false;

        _context.Posts.Remove(post);
        await _context.SaveChangesAsync();

        return true;
    }

    private static PostDto MapToDto(Post post)
    {
        return new PostDto
        {
            Id = post.Id,
            Name = post.Name,
            Description = post.Description,
            Image = post.Image,
            CreatedAt = post.CreatedAt,
            UpdatedAt = post.UpdatedAt
        };
    }
}
