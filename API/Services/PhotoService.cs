using API.Interfaces;
using CloudinaryDotNet;
using CloudinaryDotNet.Actions;

namespace API.Services
{
    public class PhotoService : IPhotoService
    {
        private readonly Cloudinary cloudinary;
        public PhotoService(IConfiguration config)
        {
            Console.WriteLine("Before Account");
            Account account = new Account(
                config.GetSection("CloudinarySettings:CloudName").Value,
                config.GetSection("CloudinarySettings:ApiKey").Value,
                config.GetSection("CloudinarySettings:ApiSecret").Value
                );
            Console.WriteLine("After account: ", account.ApiKey);
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
