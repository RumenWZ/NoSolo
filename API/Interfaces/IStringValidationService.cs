namespace API.Interfaces
{
    public interface IStringValidationService
    {
        bool hasOnlyLettersAndNumbers(string value);
        bool isValidDiscordUsername(string value);
    }
}
