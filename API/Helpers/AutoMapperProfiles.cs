using API.DTOs;
using API.Models;
using AutoMapper;

namespace API.Helpers
{
    public class AutoMapperProfiles : Profile
    {
        public AutoMapperProfiles() 
        {
            CreateMap<User, UserDTO>();
            CreateMap<User, FindUserDTO>();
            CreateMap<Message, MessageDTO>().ForMember(dest => dest.User1DisplayName, opt => opt.MapFrom(src => src.User1.DisplayName))
            .ForMember(dest => dest.User1ProfilePictureUrl, opt => opt.MapFrom(src => src.User1.ProfileImageUrl)); ;
        }
    }
}
