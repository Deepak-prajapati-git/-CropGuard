import type { AnalysisResult, CropName, DiseaseEntry, Field, FieldHealthStatus, Notification, Severity, SimilarCondition } from '../types';

// ─── Crop Catalog ─────────────────────────────────────────────────────────────

export const CROPS: CropName[] = ['Tomato', 'Potato', 'Rice', 'Wheat', 'Maize', 'Cotton', 'Chili'];

export const CROP_EMOJIS: Record<CropName, string> = {
  Tomato: '🍅',
  Potato: '🥔',
  Rice: '🌾',
  Wheat: '🌿',
  Maize: '🌽',
  Cotton: '☁️',
  Chili: '🌶️',
};

export const CROP_COLORS: Record<CropName, string> = {
  Tomato: '#E53E3E',
  Potato: '#B7791F',
  Rice: '#6F8F55',
  Wheat: '#D69E2E',
  Maize: '#ECC94B',
  Cotton: '#4A90D9',
  Chili: '#C05621',
};

export const CROP_DESCRIPTIONS: Record<CropName, string> = {
  Tomato: 'Common vegetable crop, vulnerable to fungal and bacterial diseases.',
  Potato: 'Root vegetable with high susceptibility to blight diseases.',
  Rice: 'Staple cereal crop, prone to fungal spots and bacterial infections.',
  Wheat: 'Cereal grain highly susceptible to rust and powdery mildew.',
  Maize: 'Tall cereal crop vulnerable to leaf blights and smuts.',
  Cotton: 'Fiber crop susceptible to leaf spots and fungal diseases.',
  Chili: 'Pepper crop prone to powdery mildew and anthracnose.',
};

// ─── Disease Library Data ─────────────────────────────────────────────────────

export const DISEASE_LIBRARY: DiseaseEntry[] = [
  {
    id: 'tomato-early-blight',
    name: 'Early Blight',
    crop: 'Tomato',
    shortDescription: 'A common fungal disease caused by Alternaria solani that creates dark, ringed spots on tomato leaves, stems, and fruit.',
    symptoms: [
      'Dark brown to black circular spots with concentric rings (target-board pattern)',
      'Yellowing leaf tissue surrounding the spots',
      'Spots typically appear on lower, older leaves first',
      'Affected leaves eventually turn yellow and drop',
      'Stem lesions can appear near soil level in young plants',
    ],
    conditions: [
      'Warm temperatures between 24–29°C',
      'High humidity and prolonged leaf wetness',
      'Overhead irrigation that wets leaves frequently',
      'Dense planting that restricts airflow',
      'Stressed plants with nutritional deficiencies',
    ],
    prevention: [
      'Improve airflow by spacing plants adequately',
      'Avoid overhead irrigation; use drip irrigation when possible',
      'Remove and destroy infected plant material promptly',
      'Rotate crops — avoid planting tomatoes in the same spot each year',
      'Monitor plants regularly, especially during warm humid periods',
      'Apply mulch to prevent soil splash onto lower leaves',
    ],
    expertAdvice: 'If multiple plants are affected or lesions are spreading rapidly, consult a local agricultural extension officer. Follow locally approved guidance before applying any fungicide.',
  },
  {
    id: 'tomato-leaf-mold',
    name: 'Leaf Mold',
    crop: 'Tomato',
    shortDescription: 'A fungal disease caused by Passalora fulva, primarily affecting tomato leaves under humid greenhouse or field conditions.',
    symptoms: [
      'Pale green or yellow spots on the upper leaf surface',
      'Olive-green to grayish-brown velvety mold on the underside of leaves',
      'Affected leaves curl, wither, and drop prematurely',
      'Severe infections can defoliate plants significantly',
    ],
    conditions: [
      'High humidity above 85%',
      'Poor ventilation in greenhouses or dense field plantings',
      'Temperatures between 21–24°C',
      'Prolonged wet weather or frequent dew',
    ],
    prevention: [
      'Maintain good ventilation and airflow',
      'Reduce humidity by spacing plants and pruning dense canopies',
      'Avoid wetting leaves during irrigation',
      'Remove infected leaves early before spores spread',
      'Keep records of affected areas for early intervention',
    ],
    expertAdvice: 'Leaf mold spreads rapidly under humid conditions. Seek expert guidance before treatment, especially in greenhouse environments where disease can spread quickly to nearby plants.',
  },
  {
    id: 'potato-late-blight',
    name: 'Late Blight',
    crop: 'Potato',
    shortDescription: 'A destructive oomycete disease caused by Phytophthora infestans. Historically responsible for large crop failures and highly destructive under cool, wet conditions.',
    symptoms: [
      'Irregular, water-soaked lesions on leaf edges and tips',
      'Dark brown to black necrotic areas that expand rapidly',
      'White fuzzy growth on the underside of infected leaves in humid conditions',
      'Brown discoloration spreading through stems and petioles',
      'Tubers may show a reddish-brown internal rot',
    ],
    conditions: [
      'Cool temperatures between 10–20°C',
      'Wet conditions and high humidity (above 90%)',
      'Frequent rainfall or overhead irrigation',
      'Dense plant canopy that retains moisture',
    ],
    prevention: [
      'Use certified disease-free seed tubers',
      'Plant resistant or tolerant varieties where available',
      'Avoid overhead irrigation',
      'Remove and destroy infected plant debris after harvest',
      'Monitor fields closely during cool, wet weather',
    ],
    expertAdvice: 'Late blight can devastate an entire field within days under favorable conditions. If you suspect late blight, contact your local agricultural department immediately for guidance on containment and approved management practices.',
  },
  {
    id: 'rice-brown-spot',
    name: 'Brown Spot',
    crop: 'Rice',
    shortDescription: 'A fungal disease caused by Cochliobolus miyabeanus that produces brown spots on rice leaves, leaf sheaths, and grains.',
    symptoms: [
      'Small oval to circular brown spots with gray or white centers',
      'Yellow halo surrounding the spots on older leaves',
      'Spots can merge under severe infection to cause large necrotic areas',
      'Infected grains show discoloration and spotting',
      'Severe infections cause premature leaf death',
    ],
    conditions: [
      'Nutrient-deficient soils, particularly low potassium or silicon',
      'Drought stress or waterlogged conditions',
      'High humidity and warm temperatures',
      'Infested seed material',
    ],
    prevention: [
      'Ensure balanced soil nutrition, particularly potassium',
      'Use certified, treated seed',
      'Maintain adequate but not excessive soil moisture',
      'Avoid water stress during critical growth stages',
      'Monitor fields regularly during tillering and panicle initiation',
    ],
    expertAdvice: 'Brown spot is often associated with nutrient-stressed plants. A soil test is recommended alongside disease assessment to determine whether fertilizer management can reduce susceptibility.',
  },
  {
    id: 'wheat-rust',
    name: 'Rust',
    crop: 'Wheat',
    shortDescription: 'A group of fungal diseases (leaf rust, stem rust, stripe rust) caused by Puccinia species that produce rust-colored pustules on wheat plants.',
    symptoms: [
      'Small orange, red, or yellow powdery pustules on leaves and stems',
      'Pustules rupture to release colored spore masses',
      'Surrounding tissue may turn yellow or brown',
      'Severe infection causes premature leaf death and reduced grain fill',
      'Stem rust produces dark reddish-brown pustules on stems',
    ],
    conditions: [
      'Mild temperatures between 15–25°C',
      'High humidity and dew formation',
      'Dense plant canopy with restricted airflow',
      'Susceptible varieties under favorable climate conditions',
    ],
    prevention: [
      'Plant rust-resistant or tolerant wheat varieties',
      'Monitor fields regularly from tillering to grain fill',
      'Avoid excessive nitrogen fertilization that promotes dense canopy',
      'Remove volunteer wheat plants that can harbor rust between seasons',
      'Rotate crops to break the disease cycle',
    ],
    expertAdvice: 'Wheat rust, especially stem rust, can spread rapidly and cause severe yield losses. If rust is suspected, report to your local agricultural authority promptly as some strains are highly virulent.',
  },
  {
    id: 'maize-leaf-blight',
    name: 'Leaf Blight',
    crop: 'Maize',
    shortDescription: 'Northern Corn Leaf Blight (NCLB), caused by Exserohilum turcicum, produces long cigar-shaped lesions on maize leaves and can significantly reduce yield.',
    symptoms: [
      'Long, elliptical gray-green to tan lesions on leaves',
      'Lesions typically 2.5–15 cm long with wavy, irregular margins',
      'Lesions become tan or grayish-brown as they age',
      'Severe infection can kill leaves before grain fill is complete',
      'Dark green to black spore masses visible on aging lesions',
    ],
    conditions: [
      'Moderate temperatures between 18–27°C',
      'High humidity and frequent dew or rain',
      'Dense planting with restricted airflow',
      'Residue from previous infected crops left in the field',
    ],
    prevention: [
      'Plant resistant hybrid varieties',
      'Reduce crop residue through tillage or decomposition',
      'Ensure adequate plant spacing for airflow',
      'Apply balanced fertilization to reduce plant stress',
      'Scout fields regularly from the vegetative stage onwards',
    ],
    expertAdvice: 'If early lesions are observed on lower leaves, monitor closely every 3–5 days. Seek agronomic advice before applying any foliar treatment, as timing is critical for effective management.',
  },
  {
    id: 'cotton-leaf-spot',
    name: 'Leaf Spot',
    crop: 'Cotton',
    shortDescription: 'A bacterial or fungal leaf spot disease affecting cotton that causes small, angular spots and can lead to premature defoliation under severe conditions.',
    symptoms: [
      'Small, angular spots limited by leaf veins',
      'Spots often appear water-soaked initially, then turn brown or reddish',
      'Yellowing of surrounding leaf tissue',
      'Severe infection causes early leaf drop',
      'Boll infections possible in some forms of the disease',
    ],
    conditions: [
      'Warm, wet weather with high humidity',
      'Overhead irrigation that wets foliage',
      'Dense canopy and restricted airflow',
      'Contaminated seed or infected crop debris',
    ],
    prevention: [
      'Use certified, treated seed',
      'Avoid overhead irrigation',
      'Ensure adequate spacing between plants',
      'Remove and destroy heavily infected plant debris',
      'Rotate with non-host crops to reduce inoculum',
    ],
    expertAdvice: 'Cotton leaf spot diagnosis can be complex, as multiple pathogens produce similar symptoms. Laboratory testing may be needed to confirm the causative agent before selecting an appropriate management approach.',
  },
  {
    id: 'chili-powdery-mildew',
    name: 'Powdery Mildew',
    crop: 'Chili',
    shortDescription: 'A fungal disease caused by Leveillula taurica that produces white powdery growth on chili leaves and can reduce photosynthesis and yield.',
    symptoms: [
      'White to grayish powdery coating on the upper surface of leaves',
      'Yellow irregular patches on the upper leaf surface corresponding to powdery growth below',
      'Affected leaves may curl, distort, or drop early',
      'Severe infection can affect stems and fruit',
      'Stunted growth in heavily infected plants',
    ],
    conditions: [
      'Dry, warm weather with moderate humidity',
      'Temperature range of 20–30°C',
      'Plants under water stress or nutritional imbalance',
      'Poor airflow in dense plantings or greenhouses',
    ],
    prevention: [
      'Ensure good airflow through proper plant spacing',
      'Avoid excessive nitrogen fertilization',
      'Maintain consistent irrigation to reduce water stress',
      'Remove and dispose of infected plant material',
      'Monitor regularly, especially during warm, dry periods',
    ],
    expertAdvice: 'Powdery mildew on chili can develop rapidly under favorable conditions. Consult your local agricultural extension service before applying any fungicide treatment, and always follow locally approved product labels.',
  },
];

// ─── Seeded Demo Data ─────────────────────────────────────────────────────────

const now = new Date();
const daysAgo = (n: number) => new Date(now.getTime() - n * 86400000).toISOString();

export const SEED_ANALYSES: AnalysisResult[] = [
  {
    id: 'analysis-001',
    crop: 'Tomato',
    disease: 'Early Blight',
    confidence: 0.91,
    severity: 'Moderate',
    symptoms: [
      'Dark brown circular spots with concentric rings',
      'Yellowing of leaf tissue around the affected areas',
      'Irregular leaf discoloration on lower leaves',
      'Affected leaves showing premature senescence',
    ],
    recommendations: [
      'Inspect nearby plants in the same field for similar symptoms.',
      'Remove and destroy heavily affected leaves where practical.',
      'Avoid overhead irrigation — switch to drip or furrow irrigation.',
      'Monitor the field again within 3–5 days.',
      'Consult a local agricultural expert before applying any treatment.',
    ],
    prevention: [
      'Improve airflow by maintaining adequate plant spacing.',
      'Remove infected plant material and clear crop debris.',
      'Avoid prolonged wetness on leaves.',
      'Consider crop rotation in the next season.',
      'Monitor lower leaves regularly for early signs.',
    ],
    similarConditions: [
      { name: 'Septoria Leaf Spot', description: 'Produces smaller, more uniformly circular spots with dark borders, often with visible black specks inside.' },
      { name: 'Bacterial Speck', description: 'Creates small, dark, water-soaked spots surrounded by yellow halos, typically without the concentric ring pattern.' },
    ],
    modelMode: 'demo',
    analyzedAt: daysAgo(0),
    imageDataUrl: '',
    fieldId: 'field-001',
    fieldName: 'North Tomato Field',
    saved: true,
  },
  {
    id: 'analysis-002',
    crop: 'Potato',
    disease: 'Late Blight',
    confidence: 0.87,
    severity: 'High',
    symptoms: [
      'Irregular water-soaked lesions on leaf margins',
      'Dark brown to black necrotic areas spreading rapidly',
      'White fungal growth visible on underside of leaves in humid conditions',
      'Brown discoloration spreading through petioles',
    ],
    recommendations: [
      'Isolate or monitor affected plants closely.',
      'Avoid wetting foliage during irrigation.',
      'Remove visibly infected plants to reduce spread if practical.',
      'Scout the entire field immediately.',
      'Contact a local agricultural officer for guidance on approved management options.',
    ],
    prevention: [
      'Use certified disease-free seed tubers.',
      'Plant in well-drained soil with good airflow.',
      'Avoid overhead irrigation.',
      'Monitor closely during cool, wet weather.',
      'Remove crop debris promptly after harvest.',
    ],
    similarConditions: [
      { name: 'Early Blight (Potato)', description: 'Creates circular spots with concentric rings, typically on older leaves, and is generally less aggressive than late blight.' },
      { name: 'Gray Leaf Spot', description: 'Produces more uniform, angular spots usually limited by leaf veins.' },
    ],
    modelMode: 'demo',
    analyzedAt: daysAgo(2),
    imageDataUrl: '',
    fieldId: 'field-003',
    fieldName: 'East Potato Patch',
    saved: true,
  },
  {
    id: 'analysis-003',
    crop: 'Rice',
    disease: 'Brown Spot',
    confidence: 0.78,
    severity: 'Moderate',
    symptoms: [
      'Small oval to circular brown spots with pale gray centers',
      'Yellow halos surrounding spots on older leaves',
      'Multiple spots sometimes merging on severely infected leaves',
      'Reduced leaf area from early leaf death',
    ],
    recommendations: [
      'Assess soil nutrient levels, particularly potassium.',
      'Ensure consistent water management — avoid both drought stress and waterlogging.',
      'Inspect seed stock for signs of infection before next planting.',
      'Monitor the field weekly during humid periods.',
      'Consult an agronomist about fertilizer management.',
    ],
    prevention: [
      'Use certified, treated seed.',
      'Maintain balanced soil fertility.',
      'Avoid water stress during sensitive growth stages.',
      'Practice field sanitation after harvest.',
      'Monitor for signs from tillering stage onwards.',
    ],
    similarConditions: [
      { name: 'Narrow Brown Leaf Spot', description: 'Produces narrower, more elongated spots on leaves and leaf sheaths.' },
      { name: 'Blast (Leaf Blast)', description: 'Creates diamond-shaped lesions with gray centers and distinct brown margins.' },
    ],
    modelMode: 'demo',
    analyzedAt: daysAgo(4),
    imageDataUrl: '',
    fieldId: 'field-002',
    fieldName: 'Riverside Rice Plot',
    saved: true,
  },
];

export const SEED_FIELDS: Field[] = [
  {
    id: 'field-001',
    name: 'North Tomato Field',
    crop: 'Tomato',
    area: '2.4 acres',
    plantingDate: daysAgo(60),
    location: 'Nashik region, Maharashtra',
    notes: 'Main tomato cultivation plot. Drip irrigation installed.',
    createdAt: daysAgo(65),
    healthStatus: 'Attention Needed',
    lastAnalyzedAt: daysAgo(0),
    detectionCount: 3,
    analysisIds: ['analysis-001'],
  },
  {
    id: 'field-002',
    name: 'Riverside Rice Plot',
    crop: 'Rice',
    area: '3.8 acres',
    plantingDate: daysAgo(45),
    location: 'Nashik region, Maharashtra',
    notes: 'Paddy field near the river. Flood-irrigated.',
    createdAt: daysAgo(50),
    healthStatus: 'Attention Needed',
    lastAnalyzedAt: daysAgo(4),
    detectionCount: 1,
    analysisIds: ['analysis-003'],
  },
  {
    id: 'field-003',
    name: 'East Potato Patch',
    crop: 'Potato',
    area: '1.6 acres',
    plantingDate: daysAgo(35),
    location: 'Nashik region, Maharashtra',
    notes: 'Smaller potato cultivation plot. Sprinkler irrigation.',
    createdAt: daysAgo(40),
    healthStatus: 'At Risk',
    lastAnalyzedAt: daysAgo(2),
    detectionCount: 1,
    analysisIds: ['analysis-002'],
  },
];

export const SEED_NOTIFICATIONS: import('../types').Notification[] = [
  {
    id: 'notif-001',
    title: 'High disease activity detected',
    body: 'North Tomato Field has 3 recorded detections in the last 7 days. Consider scheduling a full field inspection.',
    type: 'alert',
    read: false,
    createdAt: daysAgo(0),
    fieldId: 'field-001',
    analysisId: 'analysis-001',
  },
  {
    id: 'notif-002',
    title: 'Medium confidence result',
    body: 'Your last Potato analysis had medium confidence. A clearer image may improve the accuracy of the result.',
    type: 'warning',
    read: false,
    createdAt: daysAgo(1),
    analysisId: 'analysis-002',
  },
  {
    id: 'notif-003',
    title: 'Weekly crop health summary ready',
    body: 'Your weekly summary is available. 3 fields monitored, 2 moderate-risk detections this week.',
    type: 'info',
    read: true,
    createdAt: daysAgo(3),
  },
  {
    id: 'notif-004',
    title: 'Field not checked recently',
    body: 'Riverside Rice Plot has not been checked in 10 days. Schedule an analysis to stay on top of field health.',
    type: 'warning',
    read: false,
    createdAt: daysAgo(5),
    fieldId: 'field-002',
  },
];

// ─── Demo Inference Data ──────────────────────────────────────────────────────

export interface DemoResultTemplate {
  disease: string;
  confidence: number;
  severity: Severity;
  symptoms: string[];
  recommendations: string[];
  prevention: string[];
  similarConditions: SimilarCondition[];
}

export const DEMO_RESULTS: Record<CropName, DemoResultTemplate> = {
  Tomato: {
    disease: 'Early Blight',
    confidence: 0.91,
    severity: 'Moderate',
    symptoms: [
      'Dark brown circular spots with concentric rings (target-board pattern)',
      'Yellowing of leaf tissue surrounding the affected areas',
      'Irregular leaf discoloration primarily on lower, older leaves',
      'Spots expanding and merging under humid conditions',
    ],
    recommendations: [
      'Inspect all nearby plants for similar symptoms.',
      'Remove and dispose of heavily affected leaves where practical.',
      'Switch to drip or furrow irrigation to keep leaves dry.',
      'Improve airflow between plants by pruning dense growth.',
      'Re-inspect the field within 3–5 days.',
      'Consult a local agricultural expert before applying any treatment.',
    ],
    prevention: [
      'Maintain adequate plant spacing for airflow',
      'Avoid overhead irrigation that wets leaves',
      'Remove crop debris promptly after harvest',
      'Rotate tomato crops with non-host plants annually',
      'Monitor lower leaves regularly for early symptoms',
    ],
    similarConditions: [
      { name: 'Septoria Leaf Spot', description: 'Produces smaller circular spots with dark borders and visible black specks (pycnidia) inside.' },
      { name: 'Bacterial Speck', description: 'Creates small water-soaked spots with yellow halos, typically without concentric rings.' },
    ],
  },
  Potato: {
    disease: 'Late Blight',
    confidence: 0.87,
    severity: 'High',
    symptoms: [
      'Irregular water-soaked lesions forming at leaf edges and tips',
      'Rapid expansion to dark brown or black necrotic areas',
      'White mold-like growth visible on leaf undersides in humid conditions',
      'Brown discoloration extending into stems and petioles',
    ],
    recommendations: [
      'Scout the entire field immediately for further spread.',
      'Avoid wetting foliage — switch to ground-level irrigation.',
      'Remove and destroy visibly infected plants if practical.',
      'Isolate observations and do not move infected material between fields.',
      'Contact a local agricultural officer as soon as possible.',
    ],
    prevention: [
      'Use certified disease-free seed tubers',
      'Plant in well-drained soil with good natural airflow',
      'Avoid overhead irrigation during cool, wet periods',
      'Monitor field closely during cool and humid weather',
      'Remove all crop debris promptly after harvest',
    ],
    similarConditions: [
      { name: 'Early Blight (Potato)', description: 'Creates concentric-ringed spots on older leaves and is generally slower to spread than late blight.' },
      { name: 'Phytophthora Root Rot', description: 'Causes similar dark lesions but primarily affects stems at the soil line and roots.' },
    ],
  },
  Rice: {
    disease: 'Brown Spot',
    confidence: 0.78,
    severity: 'Moderate',
    symptoms: [
      'Small oval to circular brown spots with pale gray or white centers',
      'Yellow halo surrounding spots on older leaves',
      'Multiple spots merging on severely infected leaves',
      'Spotted and discolored grain in advanced infections',
    ],
    recommendations: [
      'Assess soil nutrient levels, especially potassium.',
      'Ensure consistent water management — avoid drought stress and waterlogging.',
      'Inspect seed stock for signs of infection.',
      'Monitor the field weekly during humid periods.',
      'Consult an agronomist for fertilizer management guidance.',
    ],
    prevention: [
      'Use certified, disease-free seed',
      'Maintain balanced soil fertilization',
      'Avoid water stress during critical growth stages',
      'Practice field sanitation after harvest',
      'Scout from tillering stage onwards',
    ],
    similarConditions: [
      { name: 'Narrow Brown Leaf Spot', description: 'Produces elongated, narrow spots on leaves and sheaths rather than oval spots.' },
      { name: 'Rice Blast', description: 'Creates diamond-shaped lesions with gray centers, typically spreading from the tips of leaves.' },
    ],
  },
  Wheat: {
    disease: 'Rust',
    confidence: 0.94,
    severity: 'High',
    symptoms: [
      'Small orange to reddish-brown powdery pustules on leaves and stems',
      'Pustules rupturing to release orange or yellow spore masses',
      'Yellowing and browning of surrounding leaf tissue',
      'Premature leaf death and reduced grain fill in advanced cases',
    ],
    recommendations: [
      'Scout the entire field to determine the extent of infection.',
      'Check if nearby wheat fields are also showing symptoms.',
      'Report suspected rust outbreaks to local agricultural authorities.',
      'Consult an expert on approved management options immediately.',
      'Avoid moving infected plant material between fields.',
    ],
    prevention: [
      'Use rust-resistant or tolerant varieties',
      'Monitor regularly from tillering through grain fill',
      'Avoid excessive nitrogen fertilization',
      'Remove volunteer wheat plants between seasons',
      'Rotate crops to reduce disease carry-over',
    ],
    similarConditions: [
      { name: 'Powdery Mildew (Wheat)', description: 'Produces white powdery growth on leaf surfaces, unlike the orange or red pustules of rust.' },
      { name: 'Septoria Blotch', description: 'Creates irregular tan blotches with visible black pycnidia, progressing from lower to upper leaves.' },
    ],
  },
  Maize: {
    disease: 'Leaf Blight',
    confidence: 0.83,
    severity: 'Moderate',
    symptoms: [
      'Long elliptical grayish-green to tan lesions on leaves',
      'Lesions typically 2.5–15 cm long with irregular, wavy margins',
      'Lesions turning tan or light brown as they age',
      'Dark spore masses forming on older lesions in humid conditions',
    ],
    recommendations: [
      'Assess the field to determine what percentage of leaf area is affected.',
      'Improve airflow by reviewing plant spacing.',
      'Reduce crop residue from previous seasons if possible.',
      'Monitor closely every 3–5 days during humid weather.',
      'Consult an agronomist before considering foliar treatment.',
    ],
    prevention: [
      'Plant resistant or tolerant hybrid varieties',
      'Reduce crop residue through tillage or decomposition',
      'Ensure adequate plant spacing',
      'Apply balanced fertilization to reduce stress',
      'Scout regularly from the vegetative stage onwards',
    ],
    similarConditions: [
      { name: 'Gray Leaf Spot', description: 'Creates narrow, rectangular lesions limited by leaf veins, appearing more rectangular than NCLB lesions.' },
      { name: 'Southern Corn Leaf Blight', description: 'Produces smaller, tan lesions with distinct reddish-brown borders.' },
    ],
  },
  Cotton: {
    disease: 'Leaf Spot',
    confidence: 0.79,
    severity: 'Low',
    symptoms: [
      'Small angular spots limited by leaf veins',
      'Spots appearing water-soaked initially, then turning brown or reddish-brown',
      'Yellowing of surrounding leaf tissue',
      'Leaf drop in severely affected plants',
    ],
    recommendations: [
      'Identify whether the infection is bacterial or fungal — send a sample to a diagnostic lab if unsure.',
      'Improve canopy airflow through proper plant spacing.',
      'Avoid wetting foliage during irrigation.',
      'Monitor frequently for signs of disease spread.',
      'Consult a local agricultural expert for guidance on management.',
    ],
    prevention: [
      'Use certified, treated seed',
      'Maintain adequate plant spacing for airflow',
      'Avoid overhead irrigation',
      'Remove and destroy heavily infected debris',
      'Rotate with non-host crops',
    ],
    similarConditions: [
      { name: 'Cercospora Leaf Spot', description: 'Produces larger, more circular spots with distinct brown borders and a lighter center.' },
      { name: 'Bacterial Blight', description: 'Creates angular water-soaked spots that turn dark brown, often affecting larger areas of the leaf.' },
    ],
  },
  Chili: {
    disease: 'Powdery Mildew',
    confidence: 0.85,
    severity: 'Low',
    symptoms: [
      'White to grayish powdery coating on the upper leaf surface',
      'Yellow irregular patches on upper leaf surface corresponding to mildew below',
      'Leaf curling and distortion on severely affected plants',
      'Early leaf drop reducing the plant canopy',
    ],
    recommendations: [
      'Remove severely affected leaves to reduce spore load.',
      'Improve airflow around affected plants.',
      'Reduce water stress with consistent irrigation.',
      'Inspect nearby plants for similar symptoms.',
      'Consult local agricultural guidance before applying any treatment.',
    ],
    prevention: [
      'Maintain adequate plant spacing for airflow',
      'Avoid excessive nitrogen fertilization',
      'Keep consistent irrigation to prevent water stress',
      'Remove infected plant material promptly',
      'Monitor regularly during warm, dry weather',
    ],
    similarConditions: [
      { name: 'Downy Mildew', description: 'Produces gray or purple downy growth on leaf undersides, unlike the white powdery coating of powdery mildew.' },
      { name: 'Cercospora Leaf Spot', description: 'Creates small circular spots with brown or pale centers rather than a powdery coating.' },
    ],
  },
};
