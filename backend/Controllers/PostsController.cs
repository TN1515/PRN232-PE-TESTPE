using Microsoft.AspNetCore.Mvc;
using backend.Services;
using backend.DTOs;

namespace backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class PostsController : ControllerBase
{
    private readonly IPostService _postService;

    public PostsController(IPostService postService)
    {
        _postService = postService;
    }

    /// <summary>
    /// Get all posts
    /// </summary>
    /// <returns>List of all posts</returns>
    [HttpGet]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public async Task<ActionResult<IEnumerable<PostDto>>> GetAllPosts()
    {
        var posts = await _postService.GetAllPostsAsync();
        return Ok(posts);
    }

    /// <summary>
    /// Get a specific post by ID
    /// </summary>
    /// <param name="id">Post ID</param>
    /// <returns>Post details</returns>
    [HttpGet("{id}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<PostDto>> GetPostById(Guid id)
    {
        var post = await _postService.GetPostByIdAsync(id);
        
        if (post == null)
            return NotFound(new { message = $"Post with ID {id} not found" });

        return Ok(post);
    }

    /// <summary>
    /// Create a new post
    /// </summary>
    /// <param name="createPostDto">Post data</param>
    /// <returns>Created post</returns>
    [HttpPost]
    [ProducesResponseType(StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<PostDto>> CreatePost([FromBody] CreatePostDto createPostDto)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        var post = await _postService.CreatePostAsync(createPostDto);
        return CreatedAtAction(nameof(GetPostById), new { id = post.Id }, post);
    }

    /// <summary>
    /// Update an existing post
    /// </summary>
    /// <param name="id">Post ID</param>
    /// <param name="updatePostDto">Updated post data</param>
    /// <returns>Updated post</returns>
    [HttpPut("{id}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<PostDto>> UpdatePost(Guid id, [FromBody] UpdatePostDto updatePostDto)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        var post = await _postService.UpdatePostAsync(id, updatePostDto);
        
        if (post == null)
            return NotFound(new { message = $"Post with ID {id} not found" });

        return Ok(post);
    }

    /// <summary>
    /// Delete a post
    /// </summary>
    /// <param name="id">Post ID</param>
    /// <returns>No content</returns>
    [HttpDelete("{id}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> DeletePost(Guid id)
    {
        var result = await _postService.DeletePostAsync(id);
        
        if (!result)
            return NotFound(new { message = $"Post with ID {id} not found" });

        return NoContent();
    }
}
