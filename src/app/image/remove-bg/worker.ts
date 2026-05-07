import { pipeline, env, RawImage } from "@xenova/transformers";

// Configuration for local-first execution
env.allowLocalModels = false;
env.useBrowserCache = true;

// Define the model and pipeline
const model = 'briaai/RMBG-1.4';
let segmenter: any = null;

// Listen for messages from the main thread
self.onmessage = async (event) => {
  const { type, image: imageUrl } = event.data;

  if (type === 'load') {
    try {
      if (!segmenter) {
        segmenter = await pipeline('image-segmentation', model, {
          progress_callback: (data: any) => {
            self.postMessage({ type: 'progress', data });
          }
        });
      }
      self.postMessage({ type: 'ready' });
    } catch (error: any) {
      self.postMessage({ type: 'error', error: error.message });
    }
  } else if (type === 'remove-bg') {
    try {
      if (!segmenter) {
        segmenter = await pipeline('image-segmentation', model);
      }

      // Load image
      const image = await RawImage.fromURL(imageUrl);
      
      // Run segmentation
      const output = await segmenter(image);
      
      // Return the mask data
      // We send back the mask so the main thread can apply it to the original high-res canvas
      // This avoids transferring large image data back and forth if possible
      self.postMessage({ 
        type: 'result', 
        mask: {
          data: output.mask.data,
          width: output.mask.width,
          height: output.mask.height
        }
      });
    } catch (error: any) {
      self.postMessage({ type: 'error', error: error.message });
    }
  }
};
