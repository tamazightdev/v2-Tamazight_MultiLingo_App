## The "Multi-Lingo: Tamazight Edition App Fine-Tuning Technical Guide

## 1. The the "Multi-Lingo: Tamazight Edition App and Gemma-3 Models, Gemma-3-4b-it and Gemma-3-1b-it: 

The development of sophisticated, on-device artificial intelligence (AI) solutions requires a meticulous approach to model selection and customization. This document details the fine-tuning process for Google's `Gemma-3-4b-it` and `Gemma-3-1b-it` models, specifically tailored to meet the requirements of the "the "Multi-Lingo: Tamazight Edition App." The objective is to equip the application with robust multilingual translation and multimodal capabilities, operating efficiently offline while ensuring user privacy.

### 1.1. Aligning with the the "Multi-Lingo: Tamazight Edition App's Vision (Key PRD Requirements)

The Product Requirements Document (PRD) for the the "Multi-Lingo: Tamazight Edition App [1] outlines a clear set of functionalities that the fine-tuned Gemma-3 models must support. These core requirements are foundational to the fine-tuning strategy:

- **Multidirectional Translation:** The app must facilitate translation between Tamazight and Arabic, French, and English. For Tamazight, the initial version (v1.0) will focus on Central Atlas Tamazight, with Tachelhit and Tarifit planned for inclusion in a major update (v2.0) following field testing of the initial release. [1] This phased introduction of Tamazight variants underscores the need for an adaptable fine-tuning methodology. The initial fine-tuning efforts will concentrate on Central Atlas Tamazight; however, the underlying process should be designed with sufficient modularity to be reapplied or extended for other dialects as new, corresponding datasets become available. This might involve training distinct LoRA adapters for each dialect or adopting a multi-dialect fine-tuning approach if the available data supports such a strategy.

- **Script Support:** For the Tamazight language, the models must support both Tifinagh and Latin scripts for input and output. [1]

- **Input/Output Modes:** The application will support text-to-text translation, speech-to-text (STT) transcription, and text-to-speech (TTS) synthesis. [1] While this guide focuses on the text-based translation aspects of fine-tuning Gemma-3, the STT and TTS components will require separate specialized models or services, potentially integrated alongside the Gemma-3 powered translation engine.

- **Image Translation (OCR):** Leveraging the multimodal capabilities of the `Gemma-3-4b-it` model (and potentially Gemma 3n models in future iterations), the app will offer the ability to translate text extracted from images, such as signs or documents. [1]

- **On-Device Processing:** A critical mandate is that all core translation functionalities operate entirely on-device. This ensures offline availability, crucial for emergency scenarios detailed in the PRD, and enhances user privacy by keeping data local. [1]

### 1.2. Introducing Google's Gemma-3-1b-it and Gemma-3-4b-it: Capabilities for Multilingual and On-Device AI

Released in March 2025 [1], Google's Gemma-3 family of models offers lightweight, state-of-the-art open models suitable for a range of applications. For the the "Multi-Lingo: Tamazight Edition App, the `gemma-3-1b-it` and `gemma-3-4b-it` variants are of particular interest due to their balance of capability and efficiency for on-device deployment. The Gemma 3 family also includes larger models like 12B and 27B parameters, and is noted for its multilingual capabilities (140+ languages) and multimodal understanding (text and images). [2]

- **Gemma-3-1b-it:** This is a text-only model with 1 billion parameters and supports a 32K token context window. [1] Its smaller size makes it particularly well-suited for efficient on-device text-based translation tasks where computational resources might be constrained.

- **Gemma-3-4b-it:** This 4 billion parameter model is multimodal, capable of processing both text and image inputs to produce text outputs. [1] It features a significantly larger 128K token context window, which is beneficial for understanding more extensive textual inputs and is essential for the app's image translation (OCR) requirement. [1]

Both models are instruction-tuned (`-it`), meaning they have been further trained to follow instructions effectively, which is advantageous for tasks like translation. [1] They also exhibit wide language support, covering over 140 languages [1], a vital feature for the app's multilingual scope. The open-weights nature of Gemma-3 models permits fine-tuning and extensive customization to specific domains and tasks. [1] Architecturally, Gemma-3 models incorporate improvements such as grouped-query attention (GQA) and Rotary Positional Embeddings (RoPE), enhancing their efficiency and performance over previous generations. [1]

The substantial context windows of the Gemma-3 models—128K tokens for the 4b-it variant and 32K for the 1b-it variant [1]—represent a significant advancement. For translation tasks, particularly those involving longer texts such as official document snippets or parliamentary discourse as envisioned in the PRD [1], this expanded context can lead to marked improvements in translation quality. 

A larger context allows the model to maintain coherence over longer passages, resolve anaphoric references more accurately, and better understand nuanced, long-range dependencies within the text. Consequently, the fine-tuning process, especially the data preparation stage, should consider strategies to effectively utilize this large context, potentially by incorporating longer training examples where appropriate and available.

The PRD explicitly requires image translation through Optical Character Recognition (OCR). [1] This functionality directly aligns with the multimodal capabilities of the `gemma-3-4b-it` model, which can process image inputs. [1] Conversely, the `gemma-3-1b-it` model is text-only and cannot fulfill this requirement. [1] This distinction dictates that the fine-tuning procedures for image translation will be exclusive to the 4b-it model, necessitating a different approach to dataset preparation for this specific task. Furthermore, Google has introduced Gemma 3n models, specifically designed for on-device multimodal applications, supporting text, image, video, and audio inputs. [4] While this guide focuses on the specified `gemma-3-4b-it`, Gemma 3n (e.g., `Gemma-3n E4B` [5]) presents a compelling alternative for future enhancements requiring broader multimodal capabilities.

The following table summarizes the key specifications of the selected Gemma-3 models in the context of the the "Multi-Lingo: Tamazight Edition App's requirements:

**Table 1: Gemma-3 Model Specifications for the "Multi-Lingo: Tamazight Edition App**
| Feature | `gemma-3-1b-it` | `gemma-3-4b-it` |
| :------------------ | :------------------------------- | :--------------------------------------------------- |
| **Parameters** | 1 Billion | 4 Billion |
| **Input Modality** | Text-only | Text and Image |
| **Context Window** | 32,768 tokens [1] | 128,000 tokens [1] |
| **Key PRD Use Cases** | Text Translation, Voice Input/Output (STT/TTS via separate models) | Text Translation, Voice Input/Output (STT/TTS via separate models), Image OCR |
| **Primary Advantage** | High efficiency for on-device text tasks | Multimodal capabilities, larger context for complex inputs |

---

## 2. Preparing Your Development Ecosystem for Gemma-3 Fine-Tuning

A well-configured development environment is crucial for successful and efficient fine-tuning of Gemma-3 models. This section outlines the necessary software, access protocols, and hardware considerations.

### 2.1. Essential Libraries and Software

The fine-tuning process will leverage several core Python libraries. It is imperative to install these, paying attention to versions that ensure compatibility with Gemma-3 models. Based on community findings and documentation, specific versions of `transformers` may be required (e.g., `transformers@v4.49.0-Gemma-3` or later, as indicated in sources like [1]). The primary libraries include:

- **`transformers`**: From Hugging Face, for accessing Gemma-3 models (`AutoModelForCausalLM`), tokenizers (`AutoTokenizer`), and quantization configurations (`BitsAndBytesConfig`).
- **`peft`** (Parameter-Efficient Fine-Tuning): Also from Hugging Face, for implementing LoRA (`LoraConfig`, `PeftModel`).
- **`trl`** (Transformer Reinforcement Learning): From Hugging Face, providing tools like `SFTTrainer` and `SFTConfig` for supervised fine-tuning.
- **`datasets`**: For loading, processing, and managing the multilingual datasets.
- **`torch`**: The underlying deep learning framework for model operations and tensor computations.
- **`accelerate`**: To simplify distributed training and manage hardware resources effectively.
- **`bitsandbytes`**: For enabling 4-bit quantization, crucial for reducing the memory footprint of large models during QLoRA fine-tuning.
- **`sentencepiece`**: The tokenizer model used by Gemma. [1]

For environments with limited computational resources, particularly VRAM, exploring tools like **Unsloth** may offer significant advantages. Several sources report Unsloth can accelerate Gemma-3 fine-tuning, reduce VRAM consumption, and address potential issues such as gradient explosions on certain GPU architectures or the handling of special tokens. [1] While this guide will primarily focus on the standard Hugging Face ecosystem, Unsloth presents a viable optimization path.

The fine-tuning process can also be managed using cloud platforms like **Vertex AI**, which provides pre-built containers and tools for PEFT (LoRA) and deployment of Gemma 3 models. [6] Vertex AI supports custom datasets in JSONL format for fine-tuning. [6]

### 2.2. Securing Access: Hugging Face Authentication and Model Permissions

Accessing Gemma-3 models from the Hugging Face Hub requires authentication and acceptance of the model usage terms. [1]

- **Hugging Face Login:** Authenticate with the Hugging Face Hub. This can be done via the command line interface (`huggingface-cli login`) or programmatically within a Python script using `from huggingface_hub import login; login(token="YOUR_HF_TOKEN")`.

- **Access Token:** A Hugging Face user access token with appropriate permissions (typically read access, write access if pushing models to the Hub) is needed. [7] This token can be generated from the user's Hugging Face account settings. For use in Colab, tokens can be stored as secrets. [8]

- **License Agreement:** Before downloading and using Gemma-3 models, users must agree to the license terms specified on the model's page on Hugging Face. [1] This step is usually prompted when attempting to download the model for the first time.

### 2.3. Hardware Recommendations for Efficient Fine-Tuning

Fine-tuning large language models, even with parameter-efficient techniques like QLoRA, demands considerable hardware resources, particularly GPU VRAM.

- **GPU VRAM:**
    - For `gemma-3-1b-it` with 4-bit QLoRA, a GPU with at least **8-12 GB of VRAM** is advisable as a starting point. [1]

    - For `gemma-3-4b-it` with 4-bit QLoRA, significantly more VRAM is needed, likely in the range of **20-24 GB VRAM** or higher, depending on batch size and sequence length. [1] Optimizations like Unsloth might enable fine-tuning on hardware with less VRAM. [1]

- **Compute Precision (`torch.dtype`):** The choice of floating-point precision impacts both memory usage and training stability.
    - **`torch.bfloat16`**: This format is generally preferred for training large models on compatible GPUs (NVIDIA Ampere architecture and newer, e.g., A100, RTX 30xx/40xx series) due to its wider dynamic range, which helps prevent overflow/underflow issues. [1]

    - **`torch.float16`**: If `bfloat16` is not supported, `float16` can be used. However, for Gemma-3, some reports indicate potential instability with `float16` on older GPU architectures. [1] Vertex AI also emphasizes precision choice, noting that lower precision like 4-bit reduces memory but might trade off performance compared to 8-bit or `float16`. [6]

- **CPU and System RAM:** A capable multi-core CPU and sufficient system RAM (e.g., 32 GB or more) are important for data preprocessing and if GPU VRAM limitations necessitate CPU offloading. [1]

It is crucial to assess the available hardware and select the appropriate `torch.dtype`. Using **Flash Attention**, if supported by the hardware (Ampere or newer) and libraries, can significantly accelerate computations and reduce memory usage during training. [7]

The following table summarizes the core libraries required for the fine-tuning process:

**Table 2: Core Libraries for Gemma-3 Fine-Tuning**
| Library Name | Purpose | Typical Installation Command |
| :-------------- | :--------------------------------------------- | :------------------------------------------ |
| `transformers` | Model loading, tokenization, configuration | `pip install transformers` |
| `peft` | Parameter-Efficient Fine-Tuning (LoRA) | `pip install peft` |
| `trl` | Supervised Fine-Tuning (SFTTrainer) | `pip install trl` |
| `datasets` | Data loading, processing, and management | `pip install datasets` |
| `torch` | Core deep learning framework | `pip install torch torchvision torchaudio` |
| `accelerate` | Distributed training and hardware abstraction | `pip install accelerate` |
| `bitsandbytes` | Quantization for efficient model loading (QLoRA) | `pip install bitsandbytes` |
| `sentencepiece` | Tokenizer model used by Gemma | `pip install sentencepiece` |

---

## 3. Loading and Initializing Gemma-3 Base Models and Tokenizers

The first step in the fine-tuning pipeline is to load the pre-trained Gemma-3 base models and their corresponding tokenizers. This section details how to acquire the specified instruction-tuned models and configure them for memory-efficient loading using 4-bit quantization.

### 3.1. Acquiring `google/gemma-3-1b-it` and `google/gemma-3-4b-it`

The instruction-tuned (`-it`) variants of Gemma-3 are recommended for this project, as they are pre-trained to follow instructions and are thus better suited for downstream tasks like translation without requiring extensive initial instruction fine-tuning. [1] The base pre-trained (`-pt`) models would necessitate a more involved fine-tuning process. The correct Hugging Face model identifiers are `google/gemma-3-1b-it` and `google/gemma-3-4b-it`. These models and their tokenizers can be loaded using the `AutoModelForCausalLM` and `AutoTokenizer` classes from the `transformers` library.

The `ai-edge-torch` Colab example for Gemma-3-1B fine-tuning uses `google/gemma-3-1b-pt` as the `model_id` initially, then later applies SFT. [8] However, for tasks like translation that benefit from strong instruction following from the start, using the `-it` variants is generally preferable.

```python
import torch
from transformers import AutoTokenizer, AutoModelForCausalLM, BitsAndBytesConfig
import os # For Hugging Face token

# Define model IDs
model_id_1b = "google/gemma-3-1b-it"
model_id_4b = "google/gemma-3-4b-it" # Requires acceptance of terms on Hugging Face

# Retrieve Hugging Face token from environment variable or secrets
hf_token = os.getenv("HF_TOKEN") # Or use a secrets management system for Colab/cloud

# Determine torch_dtype based on GPU capability
if torch.cuda.is_available() and hasattr(torch.cuda, 'get_device_capability') and torch.cuda.get_device_capability() >= (8, 0):
   torch_dtype = torch.bfloat16
   print("Using bfloat16.")
else:
   torch_dtype = torch.float16
   print("Using float16. Ensure your GPU handles this well for Gemma-3 or consider Unsloth/alternative precision.")

# Common BitsAndBytesConfig for 4-bit quantization (QLoRA)
bnb_config = BitsAndBytesConfig(
   load_in_4bit=True,
   bnb_4bit_quant_type="nf4", # Recommended for QLoRA
   bnb_4bit_compute_dtype=torch_dtype,
   bnb_4bit_use_double_quant=True, # Improves quantization quality slightly
)

# Load Gemma-3-1b-it model and tokenizer
print(f"Loading model: {model_id_1b}")
tokenizer_1b = AutoTokenizer.from_pretrained(model_id_1b, token=hf_token)
model_1b = AutoModelForCausalLM.from_pretrained(
   model_id_1b,
   quantization_config=bnb_config,
   device_map="auto", # Automatically distributes model across available GPUs
   torch_dtype=torch_dtype, # Explicitly pass torch_dtype for consistency
   token=hf_token,
   # attn_implementation="flash_attention_2" # Use if Ampere or newer GPU and library installed
)
print(f"{model_id_1b} loaded successfully.")

# Load Gemma-3-4b-it model and tokenizer
# Note: Ensure you have accepted the license for gemma-3-4b-it on Hugging Face
print(f"Loading model: {model_id_4b}")
tokenizer_4b = AutoTokenizer.from_pretrained(model_id_4b, token=hf_token)
model_4b = AutoModelForCausalLM.from_pretrained(
   model_id_4b,
   quantization_config=bnb_config,
   device_map="auto",
   torch_dtype=torch_dtype, # Explicitly pass torch_dtype
   token=hf_token,
   # attn_implementation="flash_attention_2"
)
print(f"{model_id_4b} loaded successfully.")

# Set padding token if not already set (important for training)
# Gemma tokenizers might have pad_token set by default, but good practice to check.
if tokenizer_1b.pad_token is None:
   tokenizer_1b.pad_token = tokenizer_1b.eos_token
   tokenizer_1b.pad_token_id = tokenizer_1b.eos_token_id # Also set the ID
if tokenizer_4b.pad_token is None:
   tokenizer_4b.pad_token = tokenizer_4b.eos_token
   tokenizer_4b.pad_token_id = tokenizer_4b.eos_token_id # Also set the ID
```

The `attn_implementation="flash_attention_2"` argument can be added to `from_pretrained` if the hardware (NVIDIA Ampere series or newer) and library dependencies support FlashAttention, as it can significantly speed up attention computations and reduce memory usage. [1] It is important to pass the `torch_dtype` to `from_pretrained` not only for `bnb_4bit_compute_dtype` but also for the model's operations if parts of it are not quantized or for consistency.

### 3.2. Efficient Model Loading with 4-bit Quantization (BitsAndBytesConfig)

To make fine-tuning feasible on accessible hardware, Quantized Low-Rank Adaptation (QLoRA) is employed. A core component of QLoRA is loading the base model in a quantized format, typically 4-bit. [1] This is achieved using the `BitsAndBytesConfig` class from the `transformers` library.

The key parameters in `BitsAndBytesConfig` are [1]:

- **`load_in_4bit=True`**: Instructs the library to load the model weights in 4-bit precision.

- **`bnb_4bit_quant_type="nf4"`**: Specifies the "NormalFloat4" quantization type, commonly recommended for QLoRA.

- **`bnb_4bit_compute_dtype`**: Sets the data type for computations (e.g., `torch.bfloat16` or `torch.float16`). Intermediate computations are performed in this higher precision, while weights remain in 4-bit.

- **`bnb_4bit_use_double_quant=True`**: Enables nested quantization for further memory savings and potentially improved accuracy.

This QLoRA process involves applying post-training quantization (PTQ) to the pre-trained Gemma-3 `-it` models before fine-tuning. LoRA adapters are then trained on top of this 4-bit quantized base model. [1] This is distinct from Quantization-Aware Training (QAT), where quantization is part of the model's pre-training. While Google may release QAT versions of Gemma-3 (e.g., `gemma-3-27b-it-qat-q4_0-unquantized` [1]), the standard QLoRA procedure detailed here applies quantization as a preliminary step to fine-tuning the publicly available `-it` models.

---

## 4. Crafting Datasets for Gemma-3: Multilingual and Multimodal Preparation

The success of fine-tuning heavily depends on the quality and format of the training data. With cleaned datasets for Tamazight (Tifinagh and Latin scripts), Arabic, English, and French already available in `.json` and `.csv` formats, this section focuses on transforming this data into a structure suitable for Gemma-3 fine-tuning, covering both text-to-text and image-to-text translation tasks.

### 4.1. Overview of User's Provided Datasets

The availability of pre-cleaned datasets is a significant advantage. The primary task now is to format these datasets to align with the input expectations of the Gemma-3 models and the `SFTTrainer` from the `trl` library. This involves structuring the data into a conversational or instruction-following format that Gemma-3 understands. For fine-tuning on Vertex AI, datasets are often expected in JSONL format, where each line is a valid JSON string, typically containing fields like `"input_text"` and `"output_text"` or a structured conversational format. [6]

### 4.2. Text-to-Text Translation Dataset Formatting

For text-to-text translation, each data sample needs to be formatted according to Gemma-3's specific chat/instruction template.

#### 4.2.1. Adhering to the Gemma-3 Instruction/Chat Template

Gemma-3 instruction-tuned models are trained with a specific formatter that delineates turns in a conversation and indicates roles. [1] The general format is:

```
<start_of_turn>user
{prompt_text}<end_of_turn>
<start_of_turn>model
{response_text}<end_of_turn>
```

Gemma-3 models do not utilize a distinct "system" role in their chat template; system-level instructions should be incorporated within the initial "user" turn. [1]

#### 4.2.2. Crafting Prompts for Multilingual Translation

The `{prompt_text}` should clearly instruct the model about the desired translation. Examples include:

- `"Translate from English to French: {english_sentence}"`
- `"Translate the following Tamazight (Tifinagh script) text to Arabic: {tamazight_tifinagh_sentence}"`

The `{response_text}` will be the corresponding translated sentence.

#### 4.2.3. Handling Tamazight (Tifinagh/Latin), Arabic, French, English

A Python function will dynamically construct formatted prompts based on 'source_language', 'target_language', 'source_text', and 'target_text' columns from the user's files. Careful handling of Tamazight text in both scripts is essential.

#### 4.2.4. Python Implementation for Data Transformation

The Hugging Face `trl` library's `SFTTrainer` can efficiently process datasets where each example is a dictionary containing a `"messages"` key. This key holds a list of dictionaries, each representing a turn with `"role"` (e.g., "user", "assistant") and `"content"` keys. `SFTTrainer` then uses the tokenizer's pre-defined chat template to convert this into the model-specific string. [1] This simplifies data preparation.

Alternatively, for simpler prompt-completion style fine-tuning, a dataset might just have a `"text"` field containing the fully formatted string including prompt and completion. `SFTTrainer` supports various dataset formats. The `"messages"` format is generally preferred for chat-tuned models like Gemma-3 `-it` variants.

```python
from datasets import load_dataset, Dataset
import pandas as pd

def format_translation_example_for_trl(example):
   """
   Formats a single translation example into the TRL messages format.
   Assumes 'source_language', 'target_language', 'source_text', 'target_text' keys.
   """
   source_lang = example['source_language']
   target_lang = example['target_language']
   source_text = example['source_text']
   target_text = example['target_text']

   # Include script information for Tamazight if available in source_lang
   user_prompt = f"Translate from {source_lang} to {target_lang}: {source_text}"

   return {
       "messages": [
           {"role": "user", "content": user_prompt},
           {"role": "assistant", "content": target_text}
       ]
   }

# Example for loading a .jsonl dataset
# jsonl_train_path = 'path/to/your/train_data.jsonl'
# jsonl_eval_path = 'path/to/your/eval_data.jsonl'
# try:
#     raw_datasets_jsonl = load_dataset('json', data_files={'train': jsonl_train_path, 'eval': jsonl_eval_path})
#     # Using remove_columns to keep only 'messages'
#     # Ensure original columns are actually present before trying to remove them
#     train_cols_to_remove = [col for col in raw_datasets_jsonl['train'].column_names if col != 'messages']
#     eval_cols_to_remove = [col for col in raw_datasets_jsonl['eval'].column_names if col != 'messages']

#     formatted_train_dataset_json = raw_datasets_jsonl['train'].map(
#         format_translation_example_for_trl,
#         remove_columns=train_cols_to_remove
#     )
#     formatted_eval_dataset_json = raw_datasets_jsonl['eval'].map(
#         format_translation_example_for_trl,
#         remove_columns=eval_cols_to_remove
#     )
#     print("Sample formatted JSONL example:", formatted_train_dataset_json[0] if len(formatted_train_dataset_json) > 0 else "JSONL train dataset empty or not loaded.")
# except FileNotFoundError:
#     print(f"JSONL files not found at {jsonl_train_path} or {jsonl_eval_path}. Skipping JSONL processing.")
# except Exception as e:
#     print(f"Error processing JSONL dataset: {e}")


# Example for loading a .csv dataset
# csv_train_path = 'path/to/your/train_data.csv'
# csv_eval_path = 'path/to/your/eval_data.csv'
# try:
#     csv_train_df = pd.read_csv(csv_train_path)
#     csv_eval_df = pd.read_csv(csv_eval_path)
#     train_dataset_csv_raw = Dataset.from_pandas(csv_train_df)
#     eval_dataset_csv_raw = Dataset.from_pandas(csv_eval_df)

#     train_cols_to_remove_csv = [col for col in train_dataset_csv_raw.column_names if col != 'messages']
#     eval_cols_to_remove_csv = [col for col in eval_dataset_csv_raw.column_names if col != 'messages']

#     formatted_train_dataset_csv = train_dataset_csv_raw.map(
#         format_translation_example_for_trl,
#         remove_columns=train_cols_to_remove_csv
#     )
#     formatted_eval_dataset_csv = eval_dataset_csv_raw.map(
#         format_translation_example_for_trl,
#         remove_columns=eval_cols_to_remove_csv
#     )
#     print("Sample formatted CSV example:", formatted_train_dataset_csv[0] if len(formatted_train_dataset_csv) > 0 else "CSV train dataset empty or not loaded.")
# except FileNotFoundError:
#     print(f"CSV files not found at {csv_train_path} or {csv_eval_path}. Skipping CSV dataset processing example.")
# except Exception as e:
#     print(f"Error processing CSV dataset: {e}")


# For demonstration, creating a dummy dataset if above are commented out
dummy_data = [
    {"source_language": "English", "target_language": "French", "source_text": "Hello world", "target_text": "Bonjour le monde"},
    {"source_language": "Tamazight (Tifinagh)", "target_language": "Arabic", "source_text": "ⴰⵣⵓⵍ", "target_text": "مرحبا"}
]
dummy_dataset = Dataset.from_list(dummy_data)
formatted_dataset_dummy = dummy_dataset.map(
   format_translation_example_for_trl,
   remove_columns=[col for col in dummy_dataset.column_names if col != 'messages'] # Keep only 'messages'
)
print("Sample formatted example from dummy data:")
print(formatted_dataset_dummy[0])
# Expected output structure for the first example:
# {'messages': [{'role': 'user', 'content': 'Translate from English to French: Hello world'}, {'role': 'assistant', 'content': 'Bonjour le monde'}]}
```

This script defines `format_translation_example_for_trl` which converts each raw data entry into the `{"messages": [...]}` structure. The `.map()` function efficiently applies this transformation. The `remove_columns` argument ensures only the `"messages"` column remains, as required by `SFTTrainer` when using chat templates. The tokenizer loaded for Gemma-3 `-it` models must possess the correct chat template definitions.

### 4.3. Image-to-Text Translation Dataset Formatting (for `Gemma-3-4b-it` and potentially `Gemma 3n`)

Fine-tuning `gemma-3-4b-it` for image translation (OCR followed by translation) requires a dataset of image-text pairs. The Hugging Face `trl` library supports multimodal conversations by allowing image data in input messages. [1] The structure typically involves content types like `{"type": "text", "text": "..."}` and `{"type": "image", "image": image_object}` where `image_object` could be a PIL Image.

The prompt might be: `"Extract text from this image and translate it from {source_language_in_image} to {target_language}."`. [1]

It is important to consider the image processing requirements for deployment. Gemma 3n models, for instance, accept images normalized to specific resolutions (e.g., 256x256, 512x512, 768x768) and encoded to 256 tokens each. [5] The MediaPipe LLM Inference API for Android uses `com.google.mediapipe.framework.image.MPImage` for image input. [9] While `SFTTrainer` handles training data, awareness of these deployment-time formats can inform image preprocessing or validation during dataset creation, ensuring images are of suitable quality and resolution.

```python
from PIL import Image # Pillow library for image handling
# This is a conceptual example. Actual implementation depends on image storage/access.
# Assume dataset has columns: 'image_path', 'image_source_language', 'target_language', 'target_text'

def format_ocr_translation_example_for_trl_multimodal(example):
   """
   Formats a single OCR+translation example into the TRL messages format for multimodal Gemma-3.
   The 'image' field expects a PIL Image object for local training with SFTTrainer.
   """
   image_path = example['image_path']
   # image_source_lang = example['image_source_language'] # Language of text within the image
   target_lang = example['target_language']
   target_text = example['target_text'] # Ground truth translated text

   try:
       img = Image.open(image_path).convert('RGB') # Load image and ensure it's RGB
   except FileNotFoundError:
       print(f"Warning: Image not found at {image_path}. Skipping this example.")
       return None # Skip this example if image is not found
   except Exception as e:
       print(f"Warning: Error loading image {image_path}: {e}. Skipping this example.")
       return None

   user_prompt_text = f"Extract the text from the provided image and translate it to {target_lang}."

   return {
       "messages": [
           {
               "role": "user",
               "content": [
                   {"type": "text", "text": user_prompt_text},
                   {"type": "image", "image": img} # Pass the PIL image object
               ]
           },
           {"role": "assistant", "content": target_text}
       ]
   }

# Dummy multimodal data (replace with actual image paths and text)
# dummy_multimodal_data = [
#     {"image_path": "path/to/image1.png", "target_language": "French", "target_text": "Texte traduit 1"},
#     {"image_path": "path/to/image2.jpg", "target_language": "English", "target_text": "Translated text 2"}
# ]
# if dummy_multimodal_data:
#     dummy_multimodal_dataset = Dataset.from_list(dummy_multimodal_data)
#     # Filter out None examples from map if images were not found
#     formatted_multimodal_dataset = dummy_multimodal_dataset.map(
#         format_ocr_translation_example_for_trl_multimodal
#     ).filter(lambda x: x is not None)
#     if len(formatted_multimodal_dataset) > 0:
#         print("Sample formatted multimodal example:")
#         # Note: Printing the example will show a PIL Image object, not the image itself.
#         # print(formatted_multimodal_dataset[0])
#         print(f"Formatted multimodal dataset contains {len(formatted_multimodal_dataset)} examples.")
#     else:
#         print("Formatted multimodal dataset is empty (dummy data commented out or images not found).")
# else:
#     print("Dummy multimodal data is not defined.")
```

The exact format for the `"image"` field (e.g., PIL Image object, file path, base64 string) depends on the model's processor and `SFTTrainer`'s handling. For local training, passing PIL Image objects is common as shown in vision fine-tuning guides. [1]

### 4.4. Tokenization Strategies for Prepared Datasets

Once datasets are formatted, they need to be tokenized. `SFTTrainer` generally handles tokenization internally when given a dataset with formatted text (e.g., in a `"messages"` column) and a correctly configured tokenizer. [1]

`SFTConfig` includes `dataset_kwargs` to control aspects like special token addition. For the `"messages"` format, `add_special_tokens` is often `False` because the tokenizer's chat template handles roles and delimiters. `append_concat_token` is usually `True` with `packing=True` to ensure EOS token separation for concatenated examples. [1]

---

## 5. Efficient Fine-Tuning with QLoRA for Gemma-3 Models

Parameter-Efficient Fine-Tuning (PEFT) methods like Quantized Low-Rank Adaptation (QLoRA) are essential for adapting large models like Gemma-3 on accessible hardware.

### 5.1. Understanding Quantized Low-Rank Adaptation (QLoRA)

QLoRA combines [1]:

- **Quantization:** The pre-trained base model's weights are quantized to lower precision (typically 4-bit), reducing memory.
- **Low-Rank Adaptation (LoRA):** Small, trainable "adapter" matrices are injected into specific layers (usually attention/feed-forward). Only these adapters are updated.

This significantly lowers computational/memory demands while often preserving performance. [1]

### 5.2. `LoraConfig` Specification

The `peft` library's `LoraConfig` class specifies LoRA application.

#### 5.2.1. Optimal `target_modules` for Gemma-3-1b-it and Gemma-3-4b-it

`target_modules` specifies layers for LoRA adapters. For Gemma-2, common targets were attention projections. [1] For Gemma-3, `target_modules="all-linear"` is often recommended, automatically targeting all linear layers. [1] This simplifies configuration and ensures comprehensive adaptation. The MediaPipe LLM Inference API's LoRA support for Gemma-2 models specifically targets attention layers like `q_proj`, `v_proj`, `k_proj`, `o_proj`. [9] This confirms that attention-related linear layers are key targets, aligning with the effectiveness of `"all-linear"` or a more specific list.

#### 5.2.2. Setting Rank (`r`), `lora_alpha`, and `lora_dropout`

Key LoRA hyperparameters [1]:

- **`r` (Rank):** Rank of LoRA decomposition (e.g., 8, 16, 32, 64). Larger `r` means more parameters but potentially more expressive adapters.

- **`lora_alpha`:** Scaling factor for LoRA updates (LoRA update scaled by `lora_alpha / r`). Often set to `r` or `2*r`.

- **`lora_dropout`:** Dropout probability for LoRA layers (e.g., 0.05, 0.1) for regularization.

Vertex AI fine-tuning parameters for LoRA also include `lora_rank`, `lora_alpha`, and `lora_dropout`, underscoring their general importance. [6]

The `modules_to_save` parameter in `LoraConfig` allows specifying additional modules (beyond LoRA adapters) to be unfrozen and trained, such as `["lm_head", "embed_tokens"]`. [1] If `embed_tokens` (and consequently `lm_head`) are trained and the vocabulary is effectively modified or expanded (e.g., for new Tamazight tokens), their dimensions might change. The `ai-edge-torch` Colab for Gemma-3-1B fine-tuning includes a step `merged_model.resize_token_embeddings(262144)` after merging LoRA adapters and before conversion to LiteRT format. [8] Gemma-3's vocabulary size is 262144. [1] This resizing is crucial because the `ai-edge-torch` model building functions (e.g., `gemma3.build_model_1b`) expect the standard Gemma architecture, including its original vocabulary size. If `modules_to_save` includes `embed_tokens` and `lm_head`, and their sizes change, failing to resize them back can cause errors during the `ai-edge-torch` conversion process. This detail is critical for a successful conversion pipeline.

**Table 3: QLoRA Configuration Parameters (`LoraConfig`) for Gemma-3 Models**
| Parameter | Recommended Starting Value/Range | Description | Example Sources |
| :---------------- | :------------------------------- | :--------------------------------------------------------------------------------------------------------- | :-------------- |
| `r` | 16 (try 8, 32, 64) | Rank of LoRA update matrices. | [1] |
| `lora_alpha` | 16 or 32 (often `r` or `2*r`) | Scaling factor for LoRA weights. | [1] |
| `lora_dropout` | 0.05 or 0.1 | Dropout probability for LoRA layers. | [1] |
| `target_modules` | `"all-linear"` | Specifies layers for LoRA. Can be a list of module names (e.g., `["q_proj", "k_proj", "v_proj", "o_proj"]`). | [1] |
| `task_type` | `"CAUSAL_LM"` | Task type for PEFT (Causal Language Modeling for Gemma). | [1] |
| `bias` | `"none"` | Specifies if bias parameters should be trained. `"none"` is common. | [1] |
| `modules_to_save` | `["lm_head", "embed_tokens"]` | Optional. Modules to unfreeze and train. If used, may require vocab size reconciliation before conversion. | [1] |

```python
from peft import LoraConfig

# Example LoraConfig for Gemma-3
lora_config = LoraConfig(
   r=16,
   lora_alpha=32,
   target_modules="all-linear", # Or specific modules like ["q_proj", "k_proj", "v_proj", "o_proj"]
   lora_dropout=0.05,
   bias="none",
   task_type="CAUSAL_LM",
   # modules_to_save = ["lm_head", "embed_tokens"] # Uncomment if fine-tuning vocabulary/output layer.
                                                  # If used, ensure vocab reconciliation before ai-edge-torch conversion.
)
```

---

## 6. Executing Supervised Fine-Tuning (SFT) using `SFTTrainer`

With models loaded, datasets formatted, and LoRA configured, SFT is performed using `SFTTrainer` from `trl`.

### 6.1. Configuring `SFTTrainer` and `SFTConfig`

`SFTTrainer` orchestrates training. It requires the model, tokenizer, datasets, LoRA config, and training arguments (via `SFTConfig` or `transformers.TrainingArguments`). The `ai-edge-torch` Colab uses `transformers.TrainingArguments`. [8]

```python
from trl import SFTTrainer, SFTConfig
from transformers import TrainingArguments # SFTConfig inherits from TrainingArguments

# Assuming 'model_4b' (or 'model_1b'), 'tokenizer_4b' (or 'tokenizer_1b') are loaded
# Assuming 'lora_config' is defined
# Assuming 'formatted_dataset_dummy' is prepared (e.g., from section 4.2.4 or loaded actual data)
# Replace formatted_dataset_dummy with your actual formatted_train_dataset_json/csv or merged dataset

if 'formatted_dataset_dummy' in globals() and len(formatted_dataset_dummy) > 1:
   # Splitting the dummy dataset for demonstration. Replace with actual train/eval datasets.
   train_eval_split = formatted_dataset_dummy.train_test_split(test_size=0.1, seed=42)
   train_data = train_eval_split['train']
   eval_data = train_eval_split['test']
   print(f"Using dummy dataset: {len(train_data)} train examples, {len(eval_data)} eval examples.")
elif 'formatted_train_dataset_json' in globals() and 'formatted_eval_dataset_json' in globals():
    train_data = formatted_train_dataset_json
    eval_data = formatted_eval_dataset_json
    print(f"Using JSONL dataset: {len(train_data)} train examples, {len(eval_data)} eval examples.")
else:
   print("Using placeholder empty datasets for SFTConfig. Replace with actual formatted data.")
   train_data = Dataset.from_list([])
   eval_data = Dataset.from_list([])


# Define TrainingArguments (SFTConfig can also be used directly)
# Using model_id_4b for output directory naming, adjust if training 1b model
output_dir_name = "gemma-3-4b-it-tamazight-translator" # Change for 1b model if needed

# Determine if bf16 is available from torch_dtype set earlier
use_bf16 = (torch_dtype == torch.bfloat16)
use_fp16 = (torch_dtype == torch.float16) and not use_bf16

training_args = TrainingArguments(
   output_dir=output_dir_name,
   # max_steps=150, # For quick testing [8]; for real training, use num_train_epochs
   num_train_epochs=3, # Adjust based on dataset size and convergence
   per_device_train_batch_size=1, # Adjust based on VRAM; QLoRA allows larger batches
   gradient_accumulation_steps=4, # Effective batch size = per_device_train_batch_size * gradient_accumulation_steps
   optim="paged_adamw_8bit", # Efficient optimizer for QLoRA [1]
   # optim="adamw_torch_fused", # Alternative: potentially faster on newer GPUs
   save_strategy="epoch",
   logging_steps=10,
   learning_rate=2e-4, # Common starting point for QLoRA [1]
   weight_decay=0.001,
   fp16=use_fp16, # Set based on torch_dtype
   bf16=use_bf16, # Enable bf16 if supported
   max_grad_norm=0.3,
   warmup_ratio=0.03, # Or warmup_steps [8]
   lr_scheduler_type="constant", # Or "cosine", "linear" [6]
   max_seq_length=1024, # Adjust based on data and model's context window (up to 128k for 4b)
   packing=True, # Pack multiple short sequences [1]
   gradient_checkpointing=True, # Saves memory [1]
   # report_to="tensorboard", # Or "wandb"
   # push_to_hub=False,
)

# SFTConfig specific arguments (can be passed directly to SFTTrainer or TrainingArguments)
# For chat format with "messages" column:
# dataset_kwargs for SFTConfig or SFTTrainer:
#    "add_special_tokens": False, # Handled by TRL's chat templating
#    "append_concat_token": True, # Add EOS token as separator when packing=True

# Instantiate SFTTrainer
# This example assumes training the 4B model. Adapt for the 1B model.
# Ensure 'model_4b' and 'tokenizer_4b' are the correct instances.
if len(train_data) > 0:
   trainer = SFTTrainer(
       model=model_4b, # Or model_1b
       tokenizer=tokenizer_4b, # Or tokenizer_1b
       args=training_args,
       train_dataset=train_data,
       eval_dataset=eval_data, # Optional
       peft_config=lora_config,
       dataset_kwargs={ # Pass dataset_kwargs here if using SFTTrainer directly with "messages"
           "add_special_tokens": False,
           "append_concat_token": True,
       } if "messages" in train_data.column_names else None,
       # dataset_text_field="text", # Use if dataset has a single 'text' column with pre-formatted prompts
       # formatting_func=formatting_prompts_func, # If you need a custom formatting function for non-chat data
       max_seq_length=training_args.max_seq_length, # Pass max_seq_length to SFTTrainer as well
       packing=training_args.packing, # Pass packing to SFTTrainer
   )
   print("SFTTrainer initialized.")
else:
   print("Training data is empty. SFTTrainer not initialized. Please provide actual data.")
```

Vertex AI training parameters also highlight `per_device_train_batch_size`, `gradient_accumulation_steps`, `learning_rate`, `lr_scheduler_type`, and the choice between `max_steps` or `num_train_epochs` (with `max_steps` taking precedence if both are set). [6] This consistency across platforms underscores the importance of these parameters.

### 6.2. Critical Training Parameters

Key `TrainingArguments` influencing fine-tuning [1]:

- **`output_dir`**: Directory for model checkpoints and logs.

- **`num_train_epochs` / `max_steps`**: Training duration.

- **`per_device_train_batch_size`, `gradient_accumulation_steps`**: Effective batch size.

- **`optim`**: Optimizer (`paged_adamw_8bit` is memory-efficient for QLoRA).

- **`learning_rate`**: Step size for weight updates (e.g., 2×10−4 for QLoRA).

- **`fp16`/`bf16`**: Mixed-precision training.

- **`max_seq_length`**: Maximum sequence length (impacts memory).

- **`packing=True`**: Highly recommended for efficiency with translation data containing short sentences, by concatenating examples up to `max_seq_length`. [1]

- **`gradient_checkpointing=True`**: Saves memory by recomputing activations during backward pass, at a computational cost.

Translation tasks for low-resource languages like Tamazight can be sensitive to hyperparameter choices. Iterative experimentation and monitoring validation loss and task-specific metrics (e.g., BLEU scores) are crucial. [1]

### 6.3. Initiating and Monitoring the Training Process

Training starts with `trainer.train()`. The `ai-edge-torch` Colab example saves the final adapter using `trainer.save_model("gemma3-1b-sft")`. [8]

```python
# Start fine-tuning (ensure trainer is initialized with actual data)
# if 'trainer' in globals() and len(train_data) > 0:
#     print("Starting fine-tuning...")
#     train_results = trainer.train()
#     print("Fine-tuning completed.")
#     print(train_results) # Contains training metrics

#     # Save the final LoRA adapter
#     final_adapter_path = os.path.join(output_dir_name, "final_adapter")
#     trainer.save_model(final_adapter_path) # Saves adapter to a subfolder in output_dir
#     print(f"Final LoRA adapter saved to {final_adapter_path}")

#     # SFTTrainer also saves checkpoints to output_dir/checkpoint-xxxx
#     # The last checkpoint is usually the best model if save_strategy="epoch" and early stopping isn't used.
#     # trainer.model.save_pretrained(final_adapter_path) # Alternative way to save adapter
# else:
#     print("Trainer not initialized or no training data. Skipping training.")
```

Monitoring metrics via tools like TensorBoard (Vertex AI also supports this [6]) or Weights & Biases is highly recommended.

**Table 4: Key `TrainingArguments` for Fine-Tuning Gemma-3**
| Parameter | Recommended Starting Value/Range | Description | Example Sources |
| :---------------------------- | :-------------------------------------- | :---------------------------------------------------------- | :-------------- |
| `output_dir` | `"./gemma-3-finetuned-translator"` | Directory for checkpoints and outputs. | [1] |
| `num_train_epochs` | 3-5 (adjust based on data) | Total number of training epochs. | [1] |
| `max_steps` | (Alternative to epochs, e.g., 150) | Total number of training steps. | [8] |
| `per_device_train_batch_size` | 1, 2, 4 (VRAM dependent) | Batch size per GPU. | [1] |
| `gradient_accumulation_steps` | 4, 8, 16 (to increase effective batch) | Number of steps to accumulate gradients. | [1] |
| `optim` | `"paged_adamw_8bit"` | Optimizer. | [1] |
| `learning_rate` | 2×10−4 (QLoRA typical) | Initial learning rate. | [1] |
| `bf16` / `fp16` | `True` (based on `torch_dtype`) | Enable mixed precision training. | [1] |
| `max_seq_length` | 512, 1024, 2048 (data/VRAM dependent) | Maximum input sequence length. | [1] |
| `packing` | `True` | Pack multiple short examples into one sequence. | [1] |
| `gradient_checkpointing` | `True` | Trade compute for memory. | [1] |
| `lr_scheduler_type` | `"constant"`, `"cosine"`, `"linear"` | Learning rate scheduler type. | [1] |
| `warmup_ratio` / `warmup_steps` | 0.03 - 0.1 / e.g., 2 | Proportion/number of steps for learning rate warmup. | [1] |

---

## 7. Post-Training: Evaluating and Testing Your Fine-Tuned Gemma-3 Models

Rigorous evaluation is necessary to assess performance against the the "Multi-Lingo: Tamazight Edition App's requirements. [1]

### 7.1. Qualitative and Quantitative Evaluation Strategies

- **Qualitative Evaluation:** Human assessment for fluency, adequacy, accuracy, and cultural appropriateness, especially for emergency/official contexts. [1]
- **Quantitative Evaluation:**
    - **Standard metrics:** BLEU (mentioned in PRD [1]), chrF/chrF++, METEOR, TER. [1]
    - **For image translation (OCR + translation):** OCR accuracy (e.g., Character Error Rate, Word Error Rate) combined with translation metrics on extracted text. [1]

### 7.2. Testing Translation Accuracy Across Languages and Scripts

Comprehensive testing must cover all PRD-specified translation directions [1]:

- Tamazight (Tifinagh/Latin) <=> Arabic, French, English
- Arabic <=> French, English
- French <=> English

Dedicated, unseen test sets reflecting diverse real-world usage are needed. [1]

### 7.3. Verifying Multimodal Performance (Image Translation for `Gemma-3-4b-it` / `Gemma 3n`)

For `gemma-3-4b-it` (or `Gemma 3n`), test with diverse images (signs, documents) under various conditions. [1] Evaluation involves assessing OCR accuracy and subsequent translation quality. A multi-faceted approach is recommended [1]:

- **End-to-End Translation Quality** (e.g., BLEU on final translated text).

- **Intermediate OCR Accuracy** (if feasible, evaluate raw OCR output).

- **Error Analysis** (manual review to categorize errors).

The MediaPipe LLM Inference API on Android, when used with `Gemma 3n` for multimodal tasks, takes image input alongside a text prompt (e.g., `session.addQueryChunk("Describe the objects in the image.")` followed by `session.addImage(image)`). [9] This interaction pattern provides a practical template for structuring evaluation test cases for the multimodal model, ensuring that testing reflects how the model will be queried in the deployed application.

---

## 8. Persisting Your Work: Saving and Merging Fine-Tuned Models

After satisfactory fine-tuning and evaluation, model artifacts must be saved for deployment. This involves saving LoRA adapters and typically merging them with the base model.

### 8.1. Saving LoRA Adapters

`SFTTrainer` saves checkpoints. The final LoRA adapters can be explicitly saved using `trainer.save_model("path/to/adapter_directory")`. [1] The `ai-edge-torch` Colab, for instance, saves adapters to a directory named `"gemma3-1b-sft"`. [8] This directory contains files like `adapter_model.safetensors` and `adapter_config.json`.

### 8.2. Merging Adapters with Base Models for Standalone Deployment

For deployment, merging adapters with the base model creates a single, fine-tuned model. This is facilitated by `peft`.

A critical detail when merging, especially if `modules_to_save` in `LoraConfig` included `embed_tokens` and `lm_head`, is ensuring vocabulary size consistency before conversion with tools like `ai-edge-torch`. If these modules were trained, their dimensions might change. The `ai-edge-torch` Colab for Gemma-3-1B explicitly resizes token embeddings of the merged model back to Gemma-3's standard vocabulary size (262144) using `merged_model.resize_token_embeddings(262144)`. [8] This step is vital because `ai-edge-torch`'s model building functions (e.g., `gemma3.build_model_1b`) expect the standard Gemma architecture. Mismatched embedding sizes will cause errors during conversion. Therefore, this resizing must be performed on the merged model before saving it if `embed_tokens` were part of the fine-tuning process and their size might have changed.

```python
from peft import PeftModel, AutoPeftModelForCausalLM
from transformers import AutoModelForCausalLM, AutoTokenizer
import torch
import os # For path joining

# Assume 'model_id_4b' (or 'model_id_1b') is the original base model ID
# Assume 'torch_dtype' is defined (e.g., torch.bfloat16)
# Assume 'output_dir_name' is the SFTConfig.output_dir (e.g., "gemma-3-4b-it-tamazight-translator")
# Adapters are often saved in a subfolder like 'final_adapter' or directly in output_dir by SFTTrainer
# Or, if using the Colab example: adapter_checkpoint_path = "gemma3-1b-sft" (for 1B model)
# Let's assume the trainer saved the final adapter in a sub-directory 'final_adapter' within output_dir_name
adapter_checkpoint_path = os.path.join(output_dir_name, "final_adapter")
# If trainer.save_model() was called on the main output_dir_name, then that's the path.
# Check where your trainer.save_model() actually saved the adapter files.
# For example, if trainer.save_model(output_dir_name) was used, then adapter_checkpoint_path = output_dir_name

# For merging, load the base model in its native precision (e.g., bf16/fp16)
# This is important as merge_and_unload() typically de-quantizes.
print(f"Loading base model ({model_id_4b}) for merging...")
base_model_for_merging = AutoModelForCausalLM.from_pretrained(
   model_id_4b, # Or model_id_1b
   torch_dtype=torch_dtype,
   device_map="auto", # Or "cpu" if VRAM is an issue for this step, then move back to GPU if needed
   token=hf_token # Assuming hf_token is defined
)
print("Base model loaded.")

# Load the PeftModel by attaching the adapter to the base model
print(f"Loading adapter from: {adapter_checkpoint_path}")
# Ensure adapter_checkpoint_path correctly points to the directory containing adapter_model.safetensors and adapter_config.json
try:
    merged_model = PeftModel.from_pretrained(base_model_for_merging, adapter_checkpoint_path)
    print("PeftModel loaded with adapter.")

    # Merge the LoRA weights into the base model
    merged_model = merged_model.merge_and_unload()
    print("LoRA adapters merged with the base model.")

    # CRITICAL STEP: Resize token embeddings if embed_tokens/lm_head were trained
    # and vocab size might have changed or needs to be strictly standard for ai-edge-torch.
    # Gemma-3 vocabulary size is 262144.[1, 8]
    # This step is crucial if 'modules_to_save' in LoraConfig included 'embed_tokens' and 'lm_head'.
    # Check if this is necessary for your specific fine-tuning setup.
    # For Gemma-3-1B, vocab size is 262144. For 4B, it should be the same.
    # We assume 'lora_config.modules_to_save' might have included them.
    # It's safer to include this if there's any doubt, ensuring compatibility with ai-edge-torch.
    standard_vocab_size = 262144 # For Gemma-3 models
    if merged_model.config.vocab_size != standard_vocab_size:
        print(f"Resizing token embeddings from {merged_model.config.vocab_size} to {standard_vocab_size}")
        merged_model.resize_token_embeddings(standard_vocab_size)
        # Also update the model's configuration
        merged_model.config.vocab_size = standard_vocab_size
    else:
        print(f"Token embeddings vocabulary size is already standard ({standard_vocab_size}). No resize needed.")

except Exception as e:
    print(f"Error during model merging or adapter loading: {e}")
    print("Please ensure 'adapter_checkpoint_path' is correct and contains valid adapter files.")
    merged_model = None # Ensure merged_model is None if error occurs
```

The `merge_and_unload()` method combines LoRA weights with base model weights, resulting in a standard `transformers` model object. [1] The `ai-edge-torch` Colab also saves the merged model using `merged_model.save_pretrained("merged_model", safe_serialization=True, max_shard_size="2GB")` [8], which is a good practice.

### 8.3. Storing the Final Merged Models and Tokenizers

The merged model and its tokenizer should be saved.

```python
# Define path for saving the fully merged model
# This path will be used by ai-edge-torch for conversion.
merged_model_dir = os.path.join(output_dir_name, "merged_model_for_conversion") # Example path

if merged_model:
    print(f"Saving merged model to {merged_model_dir}...")
    # Use safe_serialization=True and potentially max_shard_size for large models
    merged_model.save_pretrained(merged_model_dir, safe_serialization=True, max_shard_size="4GB") # Adjust max_shard_size as needed
    print(f"Merged model saved to {merged_model_dir}")

    # Save the tokenizer associated with the model
    # Ensure you are using the correct tokenizer instance (tokenizer_4b or tokenizer_1b)
    # This should be the same tokenizer used for training.
    # Let's assume tokenizer_4b is the relevant one for model_4b.
    active_tokenizer = tokenizer_4b # Or tokenizer_1b if that was used
    
    # Set tokenizer padding side for generation (often right-padding is preferred)
    # This is important for consistent behavior during inference.
    active_tokenizer.padding_side = "right"
    active_tokenizer.save_pretrained(merged_model_dir)
    print(f"Tokenizer saved to {merged_model_dir} with padding_side set to 'right'.")
else:
    print("Merged model is not available. Skipping saving.")
```

Using `safe_serialization=True` is recommended for saving in `safetensors` format. Setting `tokenizer.padding_side = "right"` is common for generation, as left padding is often used during training for efficiency but right padding is typical for autoregressive inference. [1]

---

## 9. Bridging to Deployment: Converting Models for MediaPipe On-Device Inference

The PRD mandates on-device processing using frameworks like MediaPipe `LlmInference`. [1] This requires converting fine-tuned PyTorch models to a format suitable for MediaPipe, typically TFLite, often packaged within a `.task` file. Google's `ai-edge-torch` library is recommended for this conversion. [1] This entire Google ecosystem (Gemma models, `ai-edge-torch`, LiteRT format, MediaPipe execution) offers an integrated path for on-device LLMs. [4]

### 9.1. Overview of the On-Device Conversion and Deployment Pipeline

The pipeline is: Fine-tuned PyTorch model (merged) -> `ai-edge-torch` conversion -> TFLite model -> Packaged into `.task` file (with tokenizer) -> Deployed via MediaPipe `LlmInference` API on Android.

### 9.2. Detailed `ai-edge-torch` Conversion Steps

This process is primarily guided by the `ai-edge-torch` Colab for Gemma-3-1B [8] and the `ai-edge-torch` library's documentation. [11]

- **Prerequisites:** Install `ai-edge-torch`.
  ```bash
  pip install ai-edge-torch
  ```
- **Step 1: Reconstruct Model with `ai-edge-torch` Layers**

  The `ai-edge-torch` library provides example builder functions (e.g., `ai_edge_torch.generative.examples.gemma3.gemma3.build_model_1b`) that reconstruct the model architecture using `ai-edge-torch` compatible layers. These functions typically load weights from a saved PyTorch checkpoint of the merged model.

- **Step 2: Ensure Vocabulary Size Consistency (Re-emphasized)**

  As detailed in Section 8.2, if `embed_tokens` were trained and vocabulary size potentially altered, the merged model saved in `merged_model_dir` must have its token embeddings resized to the standard Gemma vocabulary size (262144) before this conversion step. The `build_model_1b` function expects this standard architecture.

- **Step 3: Define Conversion Parameters**

  Key parameters for `ai-edge-torch` conversion include [8]:

    - **`PREFILL_SEQ_LENS`**: Example: `[64, 128]`. Sequence lengths for prefill computation graph.

    - **`KV_CACHE_MAX_LEN`**: Example: 1024. Maximum length for Key-Value cache.

    - **`QuantConfig`**: For TFLite model quantization. The Colab output name `gemma3_1b_finetune_q8_ekv1024.tflite` implies 8-bit quantization. [8] `ai_edge_torch.generative.layers.quantization.QuantConfig` can be used to specify this (e.g., `QuantConfig(quant_type=QuantConfig.QuantType.WEIGHT_INT8)`). Explicitly setting this is advisable.

    - **`ExportConfig`**: For attention masks during export.

- **Step 4: Convert to TFLite**
  Use `ai_edge_torch.generative.utilities.converter.convert_to_tflite`.

This overall process involves a multi-stage quantization:

1.  **QLoRA Fine-tuning:** Base model weights are 4-bit quantized during training. [1]

2.  **Merging Adapters:** `merge_and_unload()` typically results in a higher-precision model (e.g., `bf16`/`fp16`). [1]

3.  **`ai-edge-torch` Conversion:** This merged, higher-precision model is then converted to TFLite, during which further quantization (e.g., to 8-bit weights) can be applied for on-device optimization. [8] This balances training efficiency with deployment performance and size.

```python
# Conceptual Python code for ai-edge-torch conversion
# Ensure ai-edge-torch is installed: pip install ai-edge-torch
# This code is based on the Gemma-3-1B Colab [8] and needs adaptation for 4B model if a specific builder exists.
# import torch
# from ai_edge_torch.generative.examples.gemma3 import gemma3 as aie_gemma3 # For Gemma-3-1B
# from ai_edge_torch.generative.layers.quantization import QuantConfig
# from ai_edge_torch.generative.utilities import converter
# from ai_edge_torch.generative.utilities.export_config import ExportConfig
# import os

# # Path to the saved merged model directory (from section 8.3)
# merged_model_checkpoint_path = merged_model_dir # e.g., "./gemma-3-4b-it-tamazight-translator/merged_model_for_conversion"

# # Conversion parameters (adapt for your model, e.g., 4B)
# PREFILL_SEQ_LENS = [64, 128]  # Example: multiple prefill lengths for flexibility
# KV_CACHE_MAX_LEN = 2048  # Max length for Key-Value cache, adjust based on expected use and memory
# output_tflite_path = "./tflite_models/"
# os.makedirs(output_tflite_path, exist_ok=True)

# # Define quantization configuration for TFLite (e.g., 8-bit weight quantization)
# # Consult ai-edge-torch documentation for available QuantConfig options
# # Example for 8-bit weight-only quantization:
# quant_config_tflite = QuantConfig(quant_type=QuantConfig.QuantType.WEIGHT_INT8)
# # If no quantization is desired at this stage (e.g., to output fp16 TFLite), set to None.
# # quant_config_tflite = None

# # Placeholder for mask creation function [8]
# def _create_mask(mask_len, kv_cache_max_len):
#    # This is a simplified placeholder. The actual mask might be more complex.
#    # See the Colab for the full _create_mask implementation.
#    return torch.ones((1, mask_len, kv_cache_max_len)) # Highly simplified placeholder


# if os.path.exists(merged_model_checkpoint_path):
#    print(f"Loading merged PyTorch model from: {merged_model_checkpoint_path} for ai-edge-torch conversion.")
#    # This step requires a builder function for your specific Gemma model variant (1B or 4B).
#    # aie_gemma3.build_model_1b is for Gemma-3-1B.
#    # For Gemma-3-4B, you would need an equivalent `build_model_4b` or adapt the 1B builder.
#    try:
#        # Ensure the checkpoint_path points to the directory containing the PyTorch model files (e.g.,.safetensors)
#        pytorch_model_for_conversion = aie_gemma3.build_model_1b(
#            checkpoint_path=merged_model_checkpoint_path,
#            mask_cache_size=KV_CACHE_MAX_LEN # Corresponds to self.mask_cache in Gemma3 model
#        )
#        pytorch_model_for_conversion.eval() # Set to evaluation mode
#        print("PyTorch model reconstructed with ai-edge-torch layers.")

#        # Define ExportConfig (simplified, refer to Colab for exact mask details)
#        export_config = ExportConfig()

#        # Convert to TFLite
#        output_name_prefix_1b = "gemma3_1b_it_tamazight_translator_q8"

#        print(f"Starting TFLite conversion for {output_name_prefix_1b}...")
#        # The `converter.convert_to_tflite` function in the Colab [8] has specific arguments.
#        # converter.convert_to_tflite(
#        #     model=pytorch_model_for_conversion,
#        #     output_path=output_tflite_path,
#        #     output_name_prefix=output_name_prefix_1b,
#        #     prefill_seq_len=PREFILL_SEQ_LENS,
#        #     kv_cache_max_len=KV_CACHE_MAX_LEN,
#        #     quant_config=quant_config_tflite,
#        # )
#        print(f"TFLite model conversion process outlined (actual execution depends on full script and library setup).")
#        print(f"Expected output: {os.path.join(output_tflite_path, output_name_prefix_1b + '.tflite')}")

#    except ImportError:
#        print("ai-edge-torch library or its components not found. Skipping TFLite conversion example.")
#    except AttributeError as ae:
#        print(f"AttributeError during ai-edge-torch model building: {ae}.")
#    except Exception as e:
#        print(f"An error occurred during the TFLite conversion conceptual outline: {e}")
# else:
#    print(f"Merged model checkpoint not found at {merged_model_checkpoint_path}. Skipping TFLite conversion.")
```

The actual `build_model_4b` function or adaptation for the 4B model would be necessary if not directly provided by `ai-edge-torch` examples. The mask creation is also highly specific and should be carefully replicated from working examples like the official Colab. [8]

### 9.3. Understanding LiteRT `.task` Model Variants

The Hugging Face LiteRT Community (`litert-community`) hosts pre-packaged Gemma-3 `.task` files. [4] These are bundles containing the TFLite model and tokenizer data. [10] Understanding their naming conventions and configurations can guide the creation of custom `.task` files. Variants differ by quantization (f32, q8, q4), KV cache length (ekv...), and prefill strategy (multi-prefill-seq, seq128). [12] While the Tamazight app requires a custom fine-tuned model, these community variants serve as a blueprint for the target output format and common configurations well-supported by MediaPipe.

**Table 5: Overview of Example LiteRT Gemma-3 .task Model Variants from `litert-community` [12]**
| Example Filename | Base Model | Quantization | KV Cache Max Length | Prefill Strategy | Typical Size | Notes (ekv = external KV cache) |
| :------------------------------------------------ | :----------- | :------------- | :------------------ | :----------------- | :----------- | :------------------------------ |
| `Gemma3-1B-IT_multi-prefill-seq_f32_ekv1280.task` | Gemma-3-1B-IT | Float32 (f32) | 1280 | Multi-Prefill Seq | ~4.01 GB | Larger, full precision |
| `Gemma3-1B-IT_multi-prefill-seq_q8_ekv1280.task` | Gemma-3-1B-IT | Int8 (q8) | 1280 | Multi-Prefill Seq | ~1.05 GB | 8-bit quantized weights |
| `Gemma3-1B-IT_multi-prefill-seq_q4_ekv2048.task` | Gemma-3-1B-IT | Int4 (q4) | 2048 | Multi-Prefill Seq | ~555 MB | 4-bit quantized weights |
| `gemma3-1b-it-int4-web.task` | Gemma-3-1B-IT | Int4 | (Implied by size) | (Web optimized) | ~700 MB | For web deployment |
| `tokenizer.model` | N/A | N/A | N/A | N/A | ~4.69 MB | SentencePiece tokenizer model |

### 9.4. Packaging and Preparing `.task` Files

A `.task` file bundles the TFLite model (generated by `ai-edge-torch`) and the tokenizer model (e.g., `tokenizer.model` from Hugging Face, which should be the one used during fine-tuning and saved in Section 8.3) along with metadata. [1]

The `ai-edge-torch converter.convert_to_tflite` produces a `.tflite` file. The MediaPipe `LlmInference` API on Android consumes a `.task` file. [9] The exact procedure for bundling the custom `.tflite` model and the `tokenizer.model` file into a `.task` archive is not explicitly detailed step-by-step in the provided snippets for custom models. [10] mentions that `ai-edge-torch` exports TFLite models that are then "bundled with tokenizer parameters to create Task Bundles". This suggests the bundling might be a separate step or a capability within MediaPipe's tooling ecosystem. The `litert-community` repository on Hugging Face [12] includes `tokenizer.model` files alongside the `.task` files, indicating these are packaged together.

Developers will need to:

1.  Obtain the TFLite model file from the `ai-edge-torch` conversion.
2.  Ensure they have the correct `tokenizer.model` file (SentencePiece model) that corresponds to the tokenizer used throughout the fine-tuning process.
3.  Consult MediaPipe documentation or examples from the Google AI Edge team for tools or scripts that perform this bundling. The structure of existing `.task` files (which are typically zip archives) can be inspected to understand the required layout.

### 9.5. Deploying with MediaPipe `LlmInference` API on Android

This section details using the generated `.task` file in an Android application via the MediaPipe `LlmInference` API, based on. [9]

- **Dependencies:** Add `com.google.mediapipe:tasks-genai` to `build.gradle`.
  ```gradle
  dependencies {
      implementation 'com.google.mediapipe:tasks-genai:0.10.24' // Or latest version
  }
  ```
- **Model Pushing/Access:** The `.task` file needs to be accessible on the Android device. For development, this can be via `adb push` to a location like `/data/local/tmp/llm/your_model.task`. [9] For production, download from a server.
- **Initialization:**
  ```kotlin
  // Kotlin example
  import com.google.mediapipe.tasks.genai.llminference.LlmInference
  import com.google.mediapipe.tasks.genai.llminference.LlmInferenceOptions

  val options = LlmInferenceOptions.builder()
     .setModelPath("/data/local/tmp/llm/your_custom_gemma_model.task") // Path to your.task file
     .setMaxTokens(1024) // Max combined input/output tokens
     .setTopK(40)
     .setTemperature(0.8f)
     .setRandomSeed(0)
      //.setLoraPath("/path/to/lora_weights.bin") // If using on-device LoRA with compatible base
     .build()

  val llmInference = LlmInference.createFromOptions(context, options)
  ```
- **Running Inference:**
    - **Single response:**
      ```kotlin
      val result: String = llmInference.generateResponse("Translate to French: Hello")
      // Log or display result
      ```
    - **Streaming response:**
      ```kotlin
      llmInference.generateResponseAsync("Translate to French: Hello", object : LlmInference.LlmCallback {
          override fun onResult(partialResult: String, done: Boolean) {
              // Process partialResult, update UI
              if (done) {
                  // Generation finished
              }
          }
          override fun onError(error: RuntimeException) {
              // Handle error
          }
      })
      ```
- **Multimodal Prompting (with compatible Gemma 3n or adapted Gemma-3-4b-it `.task` file):**
  Requires a model in the `.task` file that supports vision input.
  ```kotlin
  import com.google.mediapipe.framework.image.BitmapImageBuilder
  import com.google.mediapipe.framework.image.MPImage
  import com.google.mediapipe.tasks.genai.llminference.LlmInferenceSession
  import com.google.mediapipe.tasks.genai.llminference.GraphOptions

  // Assuming 'llmInference' is already initialized
  // Ensure the.task model was built/packaged with vision modality enabled

  val sessionOptions = LlmInferenceSession.LlmInferenceSessionOptions.builder()
     .setGraphOptions(GraphOptions.builder().setEnableVisionModality(true).build())
      // Other session options like topK, temperature
     .build()

  val imageBitmap: Bitmap = ... // Your input image as a Bitmap
  val mpImage: MPImage = BitmapImageBuilder(imageBitmap).build()

  val session = LlmInferenceSession.createFromOptions(llmInference, sessionOptions)
  session.addQueryChunk("Extract text from this image and translate to French:")
  session.addImage(mpImage)
  val multimodalResult: String = session.generateResponse()
  // Process multimodalResult
  ```

The primary path for the Tamazight app's custom fine-tuned Gemma-3 model involves merging LoRA adapters before `ai-edge-torch` conversion, resulting in a single, specialized `.task` file. While MediaPipe also supports loading separate LoRA weights on-device for certain base models (like Gemma-2) via `setLoraPath()` [9], the merge-then-convert approach is more directly applicable for deploying custom Gemma-3 fine-tunes as described in this guide.

**Table 6: Key `LlmInferenceOptions` (Android - Kotlin/Java) [9]**
| Option Method | Description | Value Type | Example Value | Notes |
| :------------------- | :-------------------------------------------------------------------------- | :----------------- | :--------------------------------------------- | :---------------------------------------- |
| `setModelPath()` | Path to the on-device `.task` model file. | String | `"/data/local/tmp/llm/model.task"` | Required. |
| `setMaxTokens()` | Maximum number of tokens (input + output) the model handles. | Int | `1024` | Default: 512. |
| `setTopK()` | Number of tokens considered at each generation step. | Int | `40` | Default: 40. |
| `setTemperature()` | Randomness in generation (higher = more creative). | Float | `0.8f` | Default: 0.8. |
| `setRandomSeed()` | Random seed for text generation. | Int | `0` | Default: 0. |
| `setLoraPath()` | Absolute path to LoRA weights file (for on-device LoRA with specific bases). | String | `"/path/to/lora_weights.bin"` | Only for GPU models; base model dependent. |
| `setResultListener()`| Listener for asynchronous results (for `generateResponseAsync`). | `LlmInference.LlmCallback` | (Implementation) | For streaming. |
| `setErrorListener()` | Optional error listener. | `(RuntimeException) -> Unit` | (Implementation) | For error handling. |
| `setMaxNumImages()` | Max number of images for multimodal input. | Int | `1` | For Gemma 3n and similar vision models. |

---

## 10. Path Forward: Leveraging Your Custom-Tuned Gemma-3 Models

This guide has detailed a comprehensive process for fine-tuning `Gemma-3-1b-it` and `Gemma-3-4b-it` models for the the "Multi-Lingo: Tamazight Edition App, from understanding requirements to preparing for on-device deployment.

### 10.1. Recap of the Fine-Tuning and Deployment Journey

The process involved:

1.  **Understanding Requirements:** Aligning with the PRD and selecting Gemma-3 models.

2.  **Environment Setup:** Preparing the development ecosystem.

3.  **Model Loading:** Acquiring Gemma-3 models and tokenizers with 4-bit quantization.

4.  **Dataset Preparation:** Formatting multilingual text and multimodal image-text data.

5.  **QLoRA Fine-Tuning:** Configuring and executing SFT with QLoRA and `SFTTrainer`.

6.  **Evaluation:** Assessing model performance.

7.  **Model Persistence & Merging:** Saving LoRA adapters and merging them into base models, including vocabulary reconciliation.

8.  **On-Device Conversion:** Converting merged models to TFLite using `ai-edge-torch`.

9.  **.task File Packaging:** Preparing the TFLite model and tokenizer into a `.task` bundle for MediaPipe.

10. **MediaPipe Deployment:** Integrating the `.task` file into an Android application using the `LlmInference` API.

### 10.2. Recommendations for Iterative Improvement and Future Enhancements

Fine-tuning is an iterative process. Continuous enhancement can be achieved through:

- **Hyperparameter Experimentation:** Systematically tune learning rate, batch size, LoRA rank (`r`), `lora_alpha`, etc. [1]

- **Dataset Expansion and Curation:**
    - Continuously augment training data, especially for Tamazight variants (Central Atlas, Tachelhit, Tarifit), focusing on PRD-specified domains (emergency, governmental). [1]
    - Expand image translation datasets with diverse real-world images. [1]

- **Advanced Evaluation:** Implement regular human-in-the-loop (HITL) evaluation and targeted test sets. [1]

- **Incorporating Additional Tamazight Variants:** For PRD v2.0 (Tachelhit, Tarifit), train separate LoRA adapters or explore multi-dialect fine-tuning. [1]

- **Explore Gemma 3n Models:** Investigate Gemma 3n models (e.g., `Gemma-3n E2B/E4B` [4]) for potentially superior on-device multimodal capabilities (image, and future video/audio if PRD evolves) and efficiency due to selective parameter activation. These models are designed for edge use and supported by MediaPipe. [5]

- **Advanced Quantization:** Investigate further quantization techniques offered by `ai-edge-torch` or MediaPipe tools for the merged model to optimize size and performance. Gemma 3 1B has been demonstrated with int4 QAT for on-device use [13], suggesting potential for more aggressive quantization if tools and methodologies support it for custom fine-tunes.

- **Stay Updated:** Monitor developments in Gemma-3, Hugging Face libraries, `ai-edge-torch`, and MediaPipe. [1]

- **Adopt MLOps Practices:** Implement MLOps for continuous evaluation, refinement, and re-tuning. [1]

The the "Multi-Lingo: Tamazight Edition App is a significant project. The fine-tuned Gemma-3 models, deployed effectively on-device, will form its intelligent core, aiming to serve the communication needs of the Amazigh people and Moroccan society. This guide provides a robust technical foundation for this endeavor.

---

## 11. Works Cited

1.  the "Multi-Lingo: Tamazight Edition App-Fine-Tuning Gemma-3-4b-it and Gemma-3-1b-it_ A Comprehensive Technical Guide.txt
2.  PRD-Product Requirements Document_ Tamazight - Multi-Lingo_App.txt
3.  [Announcing Gemma 3 on Vertex AI](https://cloud.google.com/blog/products/ai-machine-learning/announcing-gemma-3-on-vertex-ai)
4.  [Hugging Face Text Finetune QLoRA](https://ai.google.dev/gemma/docs/core/huggingface_text_finetune_qlora)
5.  [Google AI Edge: Small language models, multimodality, RAG & function calling](https://developers.googleblog.com/en/google-ai-edge-small-language-models-multimodality-rag-function-calling/)
6.  [Gemma3_1b_fine_tune.ipynb - Colab](https://colab.sandbox.google.com/github/google-ai-edge/mediapipe-samples/blob/main/codelabs/litert_inference/Gemma3_1b_fine_tune.ipynb)
7.  [LLM Inference guide for Android](https://ai.google.dev/edge/mediapipe/solutions/genai/llm_inference/android)
8.  [Running LLM Inference on Android - Speaker Deck](https://speakerdeck.com/kambale/running-llm-inference-on-android)
9.  [litert-community/Gemma3-1B-IT at main](https://huggingface.co/litert-community/Gemma3-1B-IT/tree/main)
10. [google/gemma-3n-E4B-it-litert-preview at main](https://huggingface.co/google/gemma-3n-E4B-it-litert-preview)
11. [gemma-3-tutorial](https://github.com/proflead/gemma-3-tutorial)
12. [gemma-38 GitHub](https://github.com/gemma-38)
13. [Gemma 3 on mobile and web with Google AI Edge](https://developers.googleblog.com/en/gemma-3-on-mobile-and-web-with-google-ai-edge/)
14. [ai-edge-torch/generative/examples/README.md at main](https://github.com/google-ai-edge/ai-edge-torch/blob/main/ai_edge_torch/generative/examples/README.md)
15. [Answer to: Extract all code snippets... on Vertex AI](...)
16. [Answer to: What are the specific steps... for MediaPipe LLM Inference API on Android?](...)
17. [Answer to: Describe the different LiteRT model variations for Gemma 3...](...)
18. [Answer to: What are the key features... of 'google/gemma-3n-E4B-it-litert-preview'?](...)

---

## Updated: Product Requirements Document: the "Multi-Lingo: Tamazight Edition App

**Version:** 1.1
**Date:** June 16, 2025

### 1. Introduction

#### 1.1. Purpose of the Document
This document outlines the product requirements for "the "Multi-Lingo: Tamazight Edition," an Open-Source application featuring fine-tuned Google Gemma-3 AI models (specifically the `gemma-3-4b-it` and `gemma-3-1b-it` variants, converted for offline use via `ai-edge-torch` and deployed with MediaPipe `LlmInference`). It is a multilingual translation application designed for on-device use. It details the app's features, functionalities, user experience goals, and technical considerations to guide its development.

#### 1.2. Product Goal
To develop a reliable, accurate, and user-friendly mobile translation application that facilitates communication between Tamazight (initially Central Atlas Tamazight, expanding to Tachelhit and Tarifit), Arabic, French, and English. The app aims to serve critical needs in emergencies, government operations, and daily life for the Amazigh people and Moroccan society, leveraging on-device AI models for offline capability and privacy.

#### 1.3. Target Audience
- Amazigh-speaking individuals requiring translation.
- Government officials, public service employees, parliamentarians.
- Emergency responders.
- The general public, tourists, language learners.

#### 1.4. Background
Addresses communication gaps highlighted by events like the 2023 Al Haouz earthquake and supports official Tamazight integration efforts in Morocco. [1] The need for offline, dialect-specific translation motivates this project.

### 2. Product Overview

#### 2.1. Product Description
the "Multi-Lingo: Tamazight Edition will be an Android mobile application offering on-device translation services between Tamazight (Tifinagh and Latin scripts), Arabic, French, and English. It will support text, multimodal voice input/output (via integrated STT/TTS components), and image translation (OCR). It will be designed for high accuracy and offline functionality. Future versions may explore enhanced multimodal capabilities (e.g., video, broader image understanding) by potentially leveraging models like Gemma 3n.

#### 2.2. Key Features (High-Level)
- **Multidirectional Translation:** Tamazight <=> Arabic, Tamazight <=> French, Tamazight <=> English.
- **Support for Major Moroccan Amazigh Variants:** v1.0: Central Atlas Tamazight. v2.0: Tachelhit and Tarifit.
- **Script Support:** Tifinagh and Latin for Tamazight.
- **Input/Output Modes:** Text, Speech-to-Text, Text-to-Speech.
- **Image Translation (OCR):** Translate text from images using the fine-tuned `gemma-3-4b-it` model's multimodal features.
- **On-Device Processing:** Utilizing fine-tuned Gemma-3 AI models (converted to `.task` files for MediaPipe) for offline use and enhanced privacy.
- **Emergency Mode:** Specialized features for crisis communication.
- **Government Mode:** Tools and glossaries for official use.
- **User-Friendly Interface:** Intuitive design.
- **Color Gradient Theme:** Vibrant Aurora Glass Morphic Gradient / Indigo-Magenta Flow. [1]

#### 2.3. Technology Stack
- **Mobile Platform:** Initially React, Vite, threejs, lucide icons. Deployable to Netlify and Expo (Android/iPhone).
- **AI Models:** Google Gemma-3 (`gemma-3-4b-it`, `gemma-3-1b-it`) fine-tuned for Tamazight (Moroccan variants), Arabic, French, English.
- **Model Fine-tuning:** Hugging Face ecosystem (`transformers`, `peft`, `trl`), QLoRA. Potential use of Vertex AI for managing fine-tuning jobs.
- **Model Conversion:** `ai-edge-torch` for converting fine-tuned PyTorch models to TFLite format.
- **Packaging:** TFLite models and tokenizers bundled into `.task` files.
- **On-Device Inference:** MediaPipe `LlmInference` API for running `.task` model files locally on Android.
- **Model Fine-tuning Data:** Custom Tifinagh datasets, recorded audio (for separate STT/TTS models), parallel text corpora.

### 3. User Stories (Personas) [1]
- Amazigh-speaking citizen (Central Atlas Tamazight for v1.0) in an earthquake area needs urgent translation offline.
- Government official needs accurate translation with Central Atlas Tamazight (v1.0).
- Member of Parliament needs to understand/formulate statements in Central Atlas Tamazight (v1.0).
- Emergency medical technician needs pre-set phrases and patient response translation for Central Atlas Tamazight (v1.0).
- Student learning Central Atlas Tamazight (v1.0).

### 4. Functional Requirements

#### 4.1. Core Translation Features
- **FR1.1 Text-to-Text Translation:**
    - Tamazight (Central Atlas for v1.0; Tifinagh/Latin input/output) <=> Arabic, French, English.
    - Arabic <=> French, Arabic <=> English, French <=> English.
- **FR1.2 Speech-to-Text (STT):**
    - Input in Tamazight (Central Atlas for v1.0) transcribed to text (Tifinagh/Latin).
    - Inputs in Arabic, French, English transcribed.
- **FR1.3 Text-to-Speech (TTS):**
    - Pronunciation of Tamazight text (Central Atlas for v1.0).
    - Pronunciation of Arabic, French, English text.
- **FR1.4 Amazigh Variant Support:** v1.0: Central Atlas Tamazight. v2.0: Tachelhit, Tarifit. User selection or auto-detection if feasible.
- **FR1.5 Offline Capability:** All core translation functionalities (text, STT, TTS, image OCR) via on-device `.task` models.
- **FR1.6 Bidirectional Translation:** Supported for all pairs.
- **FR1.7 Copy/Paste Functionality.**
- **FR1.8 Image Translation (OCR):** (Added based on Technical Guide update)
    - Translate text extracted from images (signs, documents) using the fine-tuned `gemma-3-4b-it` model.
    - User can select an image from gallery or capture via camera.
    - App displays extracted text (optional) and its translation.

#### 4.2. User Interface (UI) and User Experience (UX) [1]
- **FR2.4 Translation History:** Locally stored using SQLite 3.1

#### 4.3. Emergency Mode Features [1]

#### 4.4. Government/Parliamentary Mode Features [1]

#### 4.5. Data Management
- **FR5.1 On-Device Storage:** History, favorites, preferences using SQLite 3.1
- **FR5.2 Model Storage:** Fine-tuned Gemma-3 models stored on-device as `.task` files.
- **FR5.3 Model Updates:** Mechanism for downloading updated `.task` files (via app updates or in-app downloads).

### 5. Non-Functional Requirements

- **NFR1. Performance**
    - **NFR1.1 Translation Speed:** Text translation near-instantaneous (<1-2s). STT/TTS minimal delay. OCR + translation to be optimized for reasonable speed.
    - **NFR1.2 Resource Consumption:** Optimized for battery/CPU/memory on Android, leveraging efficient `.task` models and MediaPipe. Gemma 3n's selective parameter activation could be beneficial if adopted in future.
- **NFR2. Accuracy**
    - **NFR2.1 Translation Quality:** High BLEU scores and semantic accuracy.
    - **NFR2.2 Dialectal Accuracy:** Accurate for Central Atlas Tamazight (v1.0).
- **NFR3. Usability** [1]
- **NFR4. Reliability** [1]
    - **NFR4.2 Offline Consistency:** Performance should not degrade with on-device models.
- **NFR5. Security & Privacy**
    - **NFR5.1 Data Privacy:** All user content processed/stored locally.
    - **NFR5.2 Secure Model Storage:** `.task` files are the on-device model format.
- **NFR6. Scalability**
    - **NFR6.1 Language/Dialect Expansion:** Architecture allows adding new Tamazight variants (new `.task` files or adapters).
    - **NFR6.2 Model Updates:** Efficient delivery of updated `.task` files.
- **NFR7. Maintainability** [1]
- **NFR8. Compatibility** [1]

### 6. App Flow Diagram (Text-Based) [1]
1.  App Launch (Checks for `.task` model availability).
2.  Main Translation Screen (Language selection, Text/Voice/Image input).
3.  Image Input (New/Clarified):
    - User selects/captures image.
    - App processes image using on-device `gemma-3-4b-it` (.task model).
    - Displays extracted text (optional) and translation.
4.  Emergency Mode Screen.
5.  Government/Parliamentary Mode Screen.
6.  History Screen.
7.  Favorites Screen.

#### 6.1 Image Translation (OCR): (Integrated into Main Translation Screen flow)
Ability to translate text from images using Gemma-3's multimodal features, deployed via MediaPipe with the fine-tuned `gemma-3-4b-it` model.

### 7. Future Considerations
- Exploration of Gemma 3n models for enhanced multimodal capabilities (video, audio input) and potentially improved on-device performance.
- Advanced quantization techniques for further model optimization.
- Support for on-device LoRA adapter switching if MediaPipe extends this capability broadly to custom Gemma-3 fine-tunes.

---

#### **Works cited**

1.  Fine Tune—Gemma 2b-it model _ by Aashi Dutt _ Medium.pdf
2.  ai.google.dev, accessed June 9, 2025, [https://ai.google.dev/gemma/docs/releases#:~:text=family%20of%20models.-,March%2010%2C%202025,4B%2C%2012B%20and%2027B%20sizes.](https://ai.google.dev/gemma/docs/releases#:~:text=family%20of%20models.-,March%2010%2C%202025,4B%2C%2012B%20and%2027B%20sizes.)
3.  Gemma releases | Google AI for Developers, accessed June 9, 2025, [https://ai.google.dev/gemma/docs/releases](https://ai.google.dev/gemma/docs/releases)
4.  Gemma 3 model overview | Google AI for Developers - Gemini API, accessed June 9, 2025, [https://ai.google.dev/gemma/docs/core](https://ai.google.dev/gemma/docs/core)
5.  gemma-3-1b-it - Xinference, accessed June 9, 2025, [https://inference.readthedocs.io/zh-cn/v1.4.1/models/builtin/llm/gemma-3-1b-it.html](https://inference.readthedocs.io/zh-cn/v1.4.1/models/builtin/llm/gemma-3-1b-it.html)
6.  Gemma-3-it-1B Model | MAX Builds, accessed June 9, 2025, [https://builds.modular.com/models/gemma-3-it/1B](https://builds.modular.com/models/gemma-3-it/1B)
7.  Get started with Gemma models | Google AI for Developers - Gemini API, accessed June 9, 2025, [https://ai.google.dev/gemma/docs/get_started](https://ai.google.dev/gemma/docs/get_started)
8.  Gemma 3: A Comprehensive Introduction - LearnOpenCV, accessed June 9, 2025, [https://learnopencv.com/gemma-3/](https://learnopencv.com/gemma-3/)
9.  Gemma 3 on Huggingface : r/LocalLLaMA - Reddit, accessed June 9, 2025, [https://www.reddit.com/r/LocalLLaMA/comments/1j9dt8l/gemma_3_on_huggingface/](https://www.reddit.com/r/LocalLLaMA/comments/1j9dt8l/gemma_3_on_huggingface/)
10. Gemma 3 for Beginners: An Introduction to Google's Open-Source AI - Hugging Face, accessed June 9, 2025, [https://huggingface.co/blog/proflead/gemma-3-tutorial](https://huggingface.co/blog/proflead/gemma-3-tutorial)
11. Gemma model fine-tuning | Google AI for Developers - Gemini API, accessed June 9, 2025, [https://ai.google.dev/gemma/docs/tune](https://ai.google.dev/gemma/docs/tune)
12. Gemma 3 Models — NVIDIA NeMo Framework User Guide, accessed June 9, 2025, [https://docs.nvidia.com/nemo-framework/user-guide/latest/vlms/gemma3.html](https://docs.nvidia.com/nemo-framework/user-guide/latest/vlms/gemma3.html)
13. Fine-Tune Gemma 3: A Step-by-Step Guide With Financial Q&A Dataset | DataCamp, accessed June 9, 2025, [https://www.datacamp.com/tutorial/fine-tune-gemma-3](https://www.datacamp.com/tutorial/fine-tune-gemma-3)
14. Fine-tuning Gemma 3 on a Custom Web Dataset With Firecrawl and Unsloth AI, accessed June 9, 2025, [https://www.firecrawl.dev/blog/gemma-3-fine-tuning-firecrawl-unsloth](https://www.firecrawl.dev/blog/gemma-3-fine-tuning-firecrawl-unsloth)
15. How to Fine-Tune Google Gemma 3 with Bright Data, accessed June 9, 2025, [https://brightdata.com/blog/ai/fine-tuning-gemma-3](https://brightdata.com/blog/ai/fine-tuning-gemma-3)
16. Fine-tune Gemma 3 with Unsloth, accessed June 9, 2025, [https://unsloth.ai/blog/gemma3](https://unsloth.ai/blog/gemma3)
17. Gemma 3 Fine-tuning now in Unsloth - 1.6x faster with 60% less VRAM - Reddit, accessed June 9, 2025, [https://www.reddit.com/r/LocalLLaMA/comments/1jba8c1/gemma_3_finetuning_now_in_unsloth_16x_faster_with/](https://www.reddit.com/r/LocalLLaMA/comments/1jba8c1/gemma_3_finetuning_now_in_unsloth_16x_faster_with/)
18. Fine-Tune Gemma using Hugging Face Transformers and QloRA | Google AI for Developers, accessed June 9, 2025, [https://ai.google.dev/gemma/docs/core/huggingface_text_finetune_qlora](https://ai.google.dev/gemma/docs/core/huggingface_text_finetune_qlora)
19. google/gemma-3-27b-it-qat-q4_0-unquantized · 27b int4 version - Hugging Face, accessed June 9, 2025, [https://huggingface.co/google/gemma-3-27b-it-qat-q4_0-unquantized/discussions/2](https://huggingface.co/google/gemma-3-27b-it-qat-q4_0-unquantized/discussions/2)
20. Gemma formatting and system instructions | Google AI for Developers - Gemini API, accessed June 9, 2025, [https://ai.google.dev/gemma/docs/core/prompt-structure](https://ai.google.dev/gemma/docs/core/prompt-structure)
21. Gemma 3 fakes (and ignores) the system prompt : r/LocalLLaMA - Reddit, accessed June 9, 2025, [https://www.reddit.com/r/LocalLLaMA/comments/1k7krlm/gemma_3_fakes_and_ignores_the_system_prompt/](https://www.reddit.com/r/LocalLLaMA/comments/1k7krlm/gemma_3_fakes_and_ignores_the_system_prompt/)
22. Fine-Tune Gemma for Vision Tasks using Hugging Face Transformers and QLoRA, accessed June 9, 2025, [https://ai.google.dev/gemma/docs/core/huggingface_vision_finetune_qlora](https://ai.google.dev/gemma/docs/core/huggingface_vision_finetune_qlora)
23. Fine-tune Gemma in Keras using LoRA | Google AI for Developers - Gemini API, accessed June 9, 2025, [https://ai.google.dev/gemma/docs/core/lora_tuning](https://ai.google.dev/gemma/docs/core/lora_tuning)
24. sardor233/gemma-3-12b-fine-tunned - Hugging Face, accessed June 9, 2025, [https://huggingface.co/sardor233/gemma-3-12b-fine-tunned](https://huggingface.co/sardor233/gemma-3-12b-fine-tunned)
25. Use the new Gemma 3 on Vertex AI | Google Cloud Blog, accessed June 9, 2025, [https://cloud.google.com/blog/products/ai-machine-learning/announcing-gemma-3-on-vertex-ai](https://cloud.google.com/blog/products/ai-machine-learning/announcing-gemma-3-on-vertex-ai)
26. Tune Translation LLM models by using supervised fine-tuning | Generative AI on Vertex AI, accessed June 9, 2025, [https://cloud.google.com/vertex-ai/generative-ai/docs/models/translation-use-supervised-tuning](https://cloud.google.com/vertex-ai/generative-ai/docs/models/translation-use-supervised-tuning)
27. Fine-Tuning LLM for Multilingual Tasks: Challenges and Solutions - Readability, accessed June 9, 2025, [https://www.readability.com/fine-tuning-llm-for-multilingual-tasks-challenges-and-solutions](https://www.readability.com/fine-tuning-llm-for-multilingual-tasks-challenges-and-solutions)
28. Fine-Tuning Gemma 3 VLM using QLoRA for LaTeX-OCR Dataset - LearnOpenCV, accessed June 9, 2025, [https://learnopencv.com/fine-tuning-gemma-3/](https://learnopencv.com/fine-tuning-gemma-3/)
29. Gemma-3-1B fine-tuning with SFT and on-device deployment with AI edge torch and MediaPipe. - Colab, accessed June 9, 2025, [https://colab.sandbox.google.com/github/google-ai-edge/mediapipe-samples/blob/main/codelabs/litert_inference/Gemma3_1b_fine_tune.ipynb](https://colab.sandbox.google.com/github/google-ai-edge/mediapipe-samples/blob/main/codelabs/litert_inference/Gemma3_1b_fine_tune.ipynb)
30. Fine-tune Gemma 3 1B it for Sentiment Analysis - Kaggle, accessed June 9, 2025, [https://www.kaggle.com/code/lucamassaron/fine-tune-gemma-3-1b-it-for-sentiment-analysis](https://www.kaggle.com/code/lucamassaron/fine-tune-gemma-3-1b-it-for-sentiment-analysis)
31. Gemma 3 on mobile and web with Google AI Edge, accessed June 9, 2025, [https://developers.googleblog.com/en/gemma-3-on-mobile-and-web-with-google-ai-edge/](https://developers.googleblog.com/en/gemma-3-on-mobile-and-web-with-google-ai-edge/)
32. Reverse Engineering Gemma 3n: Google's New Edge-Optimized Language Model - GitHub, accessed June 9, 2025, [https://github.com/antimatter15/reverse-engineering-gemma-3n](https://github.com/antimatter15/reverse-engineering-gemma-3n)
33. Get started with Gemma 3 LLM on Android now! - Blundell, accessed June 9, 2025, [https://blog.blundellapps.co.uk/get-started-with-gemma-3-llm-on-android-now/](https://blog.blundellapps.co.uk/get-started-with-gemma-3-llm-on-android-now/)
