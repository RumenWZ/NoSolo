using API.Interfaces;
using CloudinaryDotNet;
using CloudinaryDotNet.Actions;
using Microsoft.Extensions.Options;

namespace API.Services
{
    public class PhotoService : IPhotoService
    {
        private readonly Cloudinary cloudinary;
        public PhotoService(IOptions<CloudinarySettings> cloudinaryConfig)
        {
            Account account = new Account(
                cloudinaryConfig.Value.CloudName,
                cloudinaryConfig.Value.ApiKey,
                cloudinaryConfig.Value.ApiSecret
                );
            cloudinary = new Cloudinary( account );
        }
        public async Task<ImageUploadResult> UploadPhotoAsync(IFormFile photo)
        {
            
            var uploadResult = new ImageUploadResult();
            if (photo.Length > 0 )
            {
                using var stream = photo.OpenReadStream();
                var uploadParams = new ImageUploadParams
                {
                    File = new FileDescription(photo.FileName, stream),
                    Transformation = new Transformation().Height(500).Width(500)
                };
                uploadResult  = await cloudinary.UploadAsync(uploadParams);
            } 
            return uploadResult;
        }
    }
}
