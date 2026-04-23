/**
 * Site Configuration — ClearMend
 * Central brand config. Updating these values rebrands the entire site.
 */
window.SITE_CONFIG = {
  companyName: 'ClearMend',
  shortName: 'ClearMend',
  tagline: 'Certified Mold Remediation & Indoor Air Restoration',
  description: 'ClearMend is a certified mold remediation company restoring healthy indoor air for homes and businesses. Mold inspection, black mold removal, water-damage restoration, HVAC sanitizing, and air-quality testing.',
  phone: '(888) 744-6636',
  phoneRaw: '8887446636',
  email: 'hello@clearmend.com',
  address: 'Serving the Greater Metro & Surrounding Areas',
  hours: 'Mon–Fri: 7AM–7PM | Sat: 8AM–4PM | Sun: 24/7 Emergency',
  license: 'IICRC-Certified & Fully Insured',
  yearFounded: '2016',

  social: {
    facebook: '#',
    instagram: '#',
    google: '#',
  },

  navigation: [
    { id: 'home', label: 'Home', url: '/' },
    { id: 'about', label: 'About', url: '/about' },
    { id: 'services', label: 'Services', url: '/services' },
    { id: 'service-areas', label: 'Service Areas', url: '/service-areas' },
    { id: 'blog', label: 'Insights', url: '/blog' },
    { id: 'contact', label: 'Contact', url: '/contact' },
  ],

  services: [
    {
      id: 'mold-inspection',
      title: 'Mold Inspection & Testing',
      icon: 'microscope',
      description: 'Laboratory-grade mold inspections that locate hidden colonies, measure spore counts, and identify species. We deliver a full report with moisture mapping, thermal imaging, and remediation recommendations you can actually understand.',
      features: ['Thermal Imaging Survey', 'Air & Surface Sampling', 'Moisture Mapping', 'Accredited Lab Analysis', 'Species Identification', 'Detailed Digital Report'],
    },
    {
      id: 'mold-remediation',
      title: 'Mold Remediation',
      icon: 'shield',
      description: 'End-to-end mold removal built around strict IICRC S520 containment. We isolate affected areas, HEPA-filter the air, safely remove contaminated materials, and restore surfaces with antimicrobial treatments that prevent regrowth.',
      features: ['IICRC S520 Protocols', 'Full Containment Barriers', 'HEPA Air Scrubbing', 'Antimicrobial Treatment', 'Post-Remediation Verification', 'Third-Party Clearance Option'],
    },
    {
      id: 'black-mold-removal',
      title: 'Black Mold Removal',
      icon: 'spore',
      description: 'Specialized protocols for toxic black mold (Stachybotrys). Negative-pressure containment, respiratory-certified technicians, and complete decontamination protect your family during every step of the removal process.',
      features: ['Negative-Pressure Chambers', 'PPE-Certified Crews', 'Stachybotrys Protocols', 'Structural Decontamination', 'Safe Waste Disposal', 'Health-First Workflow'],
    },
    {
      id: 'water-damage',
      title: 'Water Damage Restoration',
      icon: 'drop',
      description: 'Rapid-response water extraction and structural drying that stops mold before it starts. 24/7 emergency dispatch, industrial dehumidification, and direct billing with most homeowners and commercial insurers.',
      features: ['24/7 Emergency Dispatch', 'Industrial Drying Equipment', 'Structural Moisture Tracking', 'Flood & Sewage Cleanup', 'Insurance Direct-Billing', 'Content Pack-Out & Storage'],
    },
    {
      id: 'attic-crawlspace',
      title: 'Attic & Crawlspace Mold',
      icon: 'house',
      description: 'Roof leaks, poor ventilation, and crawlspace humidity create perfect conditions for mold. We remediate, seal, and install long-term moisture control so hidden spaces stop threatening the air you breathe.',
      features: ['Roof-Leak Assessment', 'Insulation Replacement', 'Ventilation Correction', 'Vapor Barriers', 'Encapsulation Solutions', 'Long-Term Humidity Control'],
    },
    {
      id: 'hvac-air-quality',
      title: 'HVAC & Air Quality',
      icon: 'air',
      description: 'Mold travels through ductwork faster than anywhere else in your home. We sanitize HVAC systems, replace contaminated components, and install filtration that measurably improves indoor air quality.',
      features: ['Full HVAC Sanitizing', 'Duct Cleaning & Sealing', 'UV-C & HEPA Upgrades', 'VOC & Allergen Testing', 'IAQ Monitoring', 'Ongoing Maintenance Plans'],
    },
  ],

  serviceAreas: [
    'Scranton', 'Wilkes-Barre', 'Hazleton', 'Stroudsburg',
    'Pocono Mountains', 'Back Mountain', 'Pittston', 'Clarks Summit',
    'Dunmore', 'Old Forge', 'Moosic', 'Dallas',
    'Kingston', 'Nanticoke', 'Mountain Top', 'Dickson City',
    'Archbald', 'Carbondale', 'Honesdale', 'Milford',
    'East Stroudsburg', 'Tobyhanna', 'Mount Pocono', 'Hawley',
    'Lake Ariel', 'Hamlin', 'Moscow', 'Blakely',
    'Taylor', 'Throop', 'Jessup', 'Olyphant',
  ],

  trustBadges: [
    { icon: 'shield',    title: 'IICRC Certified',    text: 'S520-certified remediators following the industry standard for safe, thorough mold removal.' },
    { icon: 'clock',     title: '24/7 Response',      text: 'Emergency mold & water-damage crews dispatched the same day, any day of the week.' },
    { icon: 'star',      title: '5-Star Rated',       text: 'Thousands of homeowners trust ClearMend for healthier air and honest reporting.' },
    { icon: 'dollar',    title: 'Free Assessments',   text: 'Complimentary onsite assessments with transparent, written scope-of-work pricing.' },
  ],

  processSteps: [
    { title: 'Inspect',   text: 'On-site assessment with thermal imaging, moisture mapping, and lab-verified sampling.' },
    { title: 'Contain',   text: 'IICRC S520 containment, HEPA filtration, and negative air to protect the rest of your home.' },
    { title: 'Remediate', text: 'Safe removal of affected materials plus antimicrobial treatment of every surface we touch.' },
    { title: 'Verify',    text: 'Post-remediation clearance testing and a written report that confirms healthy indoor air.' },
  ],

  stats: [
    { value: '9,200+', label: 'Homes Restored' },
    { value: '4.9★',   label: 'Average Rating' },
    { value: '<24h',   label: 'Response Time' },
    { value: '100%',   label: 'Clearance Guarantee' },
  ],

  testimonials: [
    {
      name: 'Sarah M.',
      location: 'Scranton, PA',
      text: 'ClearMend found black mold behind our laundry wall that two other companies missed. Their containment was spotless — plastic sheeting everywhere, HEPA machines humming, and they documented every step. Our post-clearance lab results came back clean.',
      rating: 5,
    },
    {
      name: 'James T.',
      location: 'Wilkes-Barre, PA',
      text: 'A pipe burst in our basement on a Sunday night and ClearMend had a crew onsite in under two hours. They dried everything before mold could take hold and billed our insurance directly. Professional, calm, and genuinely kind.',
      rating: 5,
    },
    {
      name: 'Linda K.',
      location: 'Stroudsburg, PA',
      text: 'My daughter\'s asthma had been getting worse for months. ClearMend did air-quality testing, found mold in our HVAC, and sanitized the entire system. Two weeks later she was sleeping through the night again.',
      rating: 5,
    },
  ],

  faqs: [
    { q: 'How do I know if I have a mold problem?',
      a: 'Musty odors, water staining, peeling paint, recurring allergy symptoms, or a history of leaks are the most common signs. Our free onsite assessment uses thermal imaging and moisture meters to find what you can\'t see.' },
    { q: 'Is mold remediation covered by insurance?',
      a: 'If the mold stems from a sudden, covered event (like a burst pipe or storm), most policies cover remediation. We document everything and bill insurers directly so you don\'t have to fight the paperwork.' },
    { q: 'How long does remediation take?',
      a: 'Most residential projects are completed in 2–5 days. Larger commercial projects or structures with significant water damage may take longer. You\'ll always receive a written schedule before work begins.' },
    { q: 'Do I need to leave my home?',
      a: 'In most cases, no. Our containment systems and HEPA-filtered negative-pressure equipment isolate the work area. For extensive or toxic-mold projects, we\'ll recommend temporary relocation and help coordinate it.' },
  ],

  seo: {
    siteUrl: 'https://www.clearmend.com',
    ogImage: '/images/logo.png',
  },
};
