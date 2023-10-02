using API.Interfaces;

namespace API.Services
{
    public class StringValidationService : IStringValidationService
    {
        public bool hasOnlyLettersAndNumbers(string value)
        {
            if (string.IsNullOrEmpty(value))
            {
                return true; 
            }
            return !System.Text.RegularExpressions.Regex.IsMatch(value, "[^a-zA-Z0-9]");
        }

        public bool isValidDiscordUsername(string value)
        {
            if (string.IsNullOrEmpty(value))
            {
                return true;
            }
            return System.Text.RegularExpressions.Regex.IsMatch(value, "^[A-Za-z]{2,32}#[0-9]{4}$");
        }

        public bool isValidLength(string value, int minLength, int maxLength)
        {
            int valueLength = value.Length;
            return valueLength >= minLength && valueLength <= maxLength;
        }
    }
}
