﻿using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;
using DynamicData;
using KiCadDbLib.Models;
using Newtonsoft.Json;

namespace KiCadDbLib.Services
{
    public class SettingsService
    {
        public SettingsService()
        {
            Location = Path.Combine(
                Environment.GetFolderPath(Environment.SpecialFolder.ApplicationData), 
                Assembly.GetExecutingAssembly().GetName().Name, 
                "settings.json");
        }

        public string Location { get; }

        public async Task<Settings> GetSettingsAsync()
        {
            if (File.Exists(Location))
            {
                string json = await File.ReadAllTextAsync(Location);
                return JsonConvert.DeserializeObject<Settings>(json);
            }
            else
            {
                return new Settings();
            }
        }

        public async Task SetSettingsAsync(Settings settings)
        {
            if (settings is null)
            {
                throw new ArgumentNullException(nameof(settings));
            }
            FileInfo file = new FileInfo(Location);
            file.Directory.Create();
            string json = JsonConvert.SerializeObject(settings);
            using var writer = file.CreateText();
            await writer.WriteAsync(json);
        }

    }
}