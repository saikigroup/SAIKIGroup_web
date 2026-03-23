// Project detail content registry
// Each project file registers itself when imported

// Imagery projects
import './imagery/brand-identity-fintech-startup';
import './imagery/visual-campaign-fnb-chain';
import './imagery/corporate-rebranding-manufaktur';
import './imagery/digital-content-system-ecommerce';

// Technology projects
import './technology/logistics-backbone-system';
import './technology/integrated-dashboard-sales';
import './technology/custom-erp-distributor-fmcg';
import './technology/inventory-management-retail';
import './technology/hr-payroll-automation';
import './technology/customer-portal-ticketing-isp';
import './technology/data-analytics-platform-agritech';

// Consultancy projects
import './consultancy/business-process-optimization';

export { getProjectDetail, getAllProjectSlugs } from './registry';
