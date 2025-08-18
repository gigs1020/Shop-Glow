/**
 * UAE COMPLIANCE VALIDATION SYSTEM
 * Ensures all AI interactions comply with UAE regulations and Islamic values
 */

export interface UAEComplianceRules {
  halalVerification: boolean;
  culturalSensitivity: boolean;
  ageRestrictions: boolean;
  businessCompliance: boolean;
  contentModeration: boolean;
}

export interface ComplianceValidation {
  isCompliant: boolean;
  violations: string[];
  warnings: string[];
  requiredDisclaimer?: string;
}

// Prohibited keywords and content
const PROHIBITED_CONTENT = [
  'alcohol-based', 'pork-derived', 'gelatin', 'non-halal',
  'inappropriate content', 'political topics', 'excessive luxury',
  'gambling', 'adult content', 'religious insensitivity'
];

const HALAL_REQUIRED_KEYWORDS = [
  'makeup', 'cosmetics', 'skincare', 'personal care', 
  'beauty products', 'fragrance', 'perfume'
];

const UAE_VAT_RATE = 0.05; // 5% VAT

export function validateMessageCompliance(
  message: string, 
  isCustomerInteraction: boolean = true
): ComplianceValidation {
  const violations: string[] = [];
  const warnings: string[] = [];
  let requiredDisclaimer: string | undefined;

  const lowerMessage = message.toLowerCase();

  // 1. Check for prohibited content
  PROHIBITED_CONTENT.forEach(prohibited => {
    if (lowerMessage.includes(prohibited)) {
      violations.push(`Contains prohibited content: ${prohibited}`);
    }
  });

  // 2. Halal verification requirement
  const requiresHalalCheck = HALAL_REQUIRED_KEYWORDS.some(keyword => 
    lowerMessage.includes(keyword)
  );
  
  if (requiresHalalCheck && !lowerMessage.includes('halal')) {
    warnings.push('Product recommendation should include halal verification');
    requiredDisclaimer = 'Halal certification status available on request';
  }

  // 3. Price mentions should include VAT
  if (lowerMessage.includes('price') || lowerMessage.includes('aed') || lowerMessage.includes('$')) {
    if (!lowerMessage.includes('vat') && !lowerMessage.includes('tax')) {
      warnings.push('Price mentions should include VAT information');
      requiredDisclaimer = 'All prices include 5% UAE VAT';
    }
  }

  // 4. Age-sensitive content
  if (lowerMessage.includes('teen') || lowerMessage.includes('young') || lowerMessage.includes('child')) {
    warnings.push('Age-sensitive content - parental guidance may be required');
  }

  // 5. Cultural sensitivity check
  const culturallyInappropriate = [
    'revealing', 'immodest', 'provocative', 'nightlife', 'party makeup'
  ];
  
  culturallyInappropriate.forEach(term => {
    if (lowerMessage.includes(term)) {
      violations.push(`Culturally inappropriate content: ${term}`);
    }
  });

  return {
    isCompliant: violations.length === 0,
    violations,
    warnings,
    requiredDisclaimer
  };
}

export function formatPriceUAE(price: number): string {
  const withVAT = price * (1 + UAE_VAT_RATE);
  return `AED ${withVAT.toFixed(2)} (inc. 5% VAT)`;
}

export function getUAEComplianceDisclaimer(): string {
  return "This service operates in compliance with UAE regulations and Islamic values. All product recommendations are subject to halal verification and UAE import compliance.";
}

export function validateProductCompliance(product: any): ComplianceValidation {
  const violations: string[] = [];
  const warnings: string[] = [];

  // Check product description for compliance
  if (product.description) {
    const descriptionCheck = validateMessageCompliance(product.description);
    violations.push(...descriptionCheck.violations);
    warnings.push(...descriptionCheck.warnings);
  }

  // Check if halal status is specified for relevant products
  if (product.category && ['makeup', 'beauty-tools', 'mother-care'].includes(product.category)) {
    if (!product.isHalalCertified && product.isHalalCertified !== false) {
      warnings.push('Halal certification status not specified');
    }
  }

  // UAE import compliance
  if (!product.uaeImportCompliant) {
    violations.push('Product not verified for UAE import compliance');
  }

  return {
    isCompliant: violations.length === 0,
    violations,
    warnings
  };
}

export function getIslamicGreeting(): string {
  const greetings = [
    "Assalamu Alaikum and welcome!",
    "Welcome! May peace be upon you.",
    "Ahlan wa sahlan! Welcome to Shop&Glow UAE."
  ];
  
  return greetings[Math.floor(Math.random() * greetings.length)];
}

export function getUAEBusinessHours(): string {
  return "Our customer service is available Sunday to Thursday, 9:00 AM to 6:00 PM UAE time, respecting local prayer times.";
}

export const UAE_COMPLIANCE_PROMPTS = {
  halalVerification: "Is this product halal-certified? We prioritize halal-compliant beauty products for our customers.",
  vatDisclaimer: "All prices displayed include 5% UAE VAT as per UAE regulations.",
  returnPolicy: "Returns and exchanges comply with UAE Consumer Protection Laws and are processed within 14 days.",
  importCompliance: "All products are verified for UAE import regulations and customs requirements.",
  culturalSensitivity: "We respect Islamic values and UAE cultural norms in all our recommendations.",
  ageVerification: "For customers under 18, parental guidance is recommended for beauty product purchases."
};