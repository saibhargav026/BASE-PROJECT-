using System.Security.Cryptography;
using System.Text;

namespace OnlineAcOpening.Interface
{
    public class EncryptoData
    {
        static void DeriveKeyAndIv(byte[] phrase, byte[] salt, int iterations, out byte[] key, out byte[] iv)
        {
            var hashList = new List<byte>();

            var preHashLength = phrase.Length + (salt?.Length ?? 0);
            var preHash = new byte[preHashLength];

            Buffer.BlockCopy(phrase, 0, preHash, 0, phrase.Length);
            if (salt != null)
                Buffer.BlockCopy(salt, 0, preHash, phrase.Length, salt.Length);

            var hash = MD5.Create();
            var currentHash = hash.ComputeHash(preHash);

            for (var i = 1; i < iterations; i++)
            {
                currentHash = hash.ComputeHash(currentHash);
            }

            hashList.AddRange(currentHash);

            while (hashList.Count < 48) // for 32-byte key and 16-byte ivz
            {
                preHashLength = currentHash.Length + phrase.Length + (salt?.Length ?? 0);
                preHash = new byte[preHashLength];

                Buffer.BlockCopy(currentHash, 0, preHash, 0, currentHash.Length);
                Buffer.BlockCopy(phrase, 0, preHash, currentHash.Length, phrase.Length);
                if (salt != null)
                    Buffer.BlockCopy(salt, 0, preHash, currentHash.Length + phrase.Length, salt.Length);

                currentHash = hash.ComputeHash(preHash);

                for (var i = 1; i < iterations; i++)
                {
                    currentHash = hash.ComputeHash(currentHash);
                }

                hashList.AddRange(currentHash);
            }

            hash.Clear();
            key = new byte[32];
            iv = new byte[16];
            hashList.CopyTo(0, key, 0, 32);
            hashList.CopyTo(32, iv, 0, 16);
        }
        public static string DecryptAes(string encrypted)
        {
            string encryptedString = encrypted.Replace(" ", "+");
            string phrase = "01234567890";
            byte[] base64Bytes = Convert.FromBase64String(encryptedString);
            var saltBytes = base64Bytes[8..16];
            var cipherTextBytes = base64Bytes[16..];

            var phraseBytes = Encoding.UTF8.GetBytes(phrase);

            DeriveKeyAndIv(phraseBytes, saltBytes, 1, out var keyBytes, out var ivBytes);

            // create the AES decryptor
            using var aes = Aes.Create();
            aes.Key = keyBytes;
            aes.IV = ivBytes;
            // here are the config that cryptojs uses by default
            // https://cryptojs.gitbook.io/docs/#ciphers
            aes.KeySize = 256;
            aes.Padding = PaddingMode.PKCS7;
            aes.Mode = CipherMode.CBC;
            var decryptor = aes.CreateDecryptor(keyBytes, ivBytes);

            // example code on MSDN https://docs.microsoft.com/en-us/dotnet/api/system.security.cryptography.aes?view=net-5.0
            using var msDecrypt = new MemoryStream(cipherTextBytes);
            using var csDecrypt = new CryptoStream(msDecrypt, decryptor, CryptoStreamMode.Read);
            using var srDecrypt = new StreamReader(csDecrypt);

            // read the decrypted bytes from the decrypting stream and place them in a string.
            return srDecrypt.ReadToEnd();

            //return encrypted;
        }

        #region Encryption Details
        public static string EncryptString(string plainText)
        {
            byte[] iv = new byte[16];
            byte[] array;
            string key = "01234567890123456789012345678901";
            using (Aes aes = Aes.Create())
            {
                aes.Key = Encoding.UTF8.GetBytes(key);
                aes.IV = iv;
                aes.Padding = PaddingMode.PKCS7;
                aes.Mode = CipherMode.CBC;

                ICryptoTransform encryptor = aes.CreateEncryptor(aes.Key, aes.IV);

                using (MemoryStream memoryStream = new MemoryStream())
                {
                    using (CryptoStream cryptoStream = new CryptoStream((Stream)memoryStream, encryptor, CryptoStreamMode.Write))
                    {
                        using (StreamWriter streamWriter = new StreamWriter((Stream)cryptoStream))
                        {
                            streamWriter.Write(plainText);
                        }

                        array = memoryStream.ToArray();
                    }
                }
            }

            return Convert.ToBase64String(array);

            //return plainText;
        }
        #endregion
    }
}
