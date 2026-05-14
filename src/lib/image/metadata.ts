import ExifReader from "exifreader";

export async function extractMetadata(file: File) {
  try {
    const tags = await ExifReader.load(file);
    
    // Filter out sensitive tags for display or specific processing
    const cleanTags: Record<string, any> = {};
    
    for (const [key, value] of Object.entries(tags)) {
      if (value && typeof value === 'object' && 'description' in value) {
        cleanTags[key] = value.description;
      } else {
        cleanTags[key] = value;
      }
    }

    return {
      make: cleanTags.Make,
      model: cleanTags.Model,
      software: cleanTags.Software,
      dateTime: cleanTags.DateTime,
      dimensions: {
        width: cleanTags['Image Width'] || cleanTags.PixelXDimension,
        height: cleanTags['Image Height'] || cleanTags.PixelYDimension,
      },
      exposure: {
        fNumber: cleanTags.FNumber,
        exposureTime: cleanTags.ExposureTime,
        iso: cleanTags.ISOSpeedRatings,
      },
      gps: cleanTags.GPSLatitude ? {
        lat: cleanTags.GPSLatitude,
        lng: cleanTags.GPSLongitude,
      } : null,
      all: cleanTags
    };
  } catch (err) {
    console.warn("Metadata extraction failed", err);
    return null;
  }
}
