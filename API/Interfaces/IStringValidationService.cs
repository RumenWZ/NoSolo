using System.ComponentModel.DataAnnotations;

namespace API.Interfaces
{
    public interface IStringValidationService
    {
        bool hasOnlyLettersAndNumbers(string value);
        bool isValidDiscordUsername(string value);
        bool isValidLength(string value, int minLength, int maxLength);
    }
}
