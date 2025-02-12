import * as cheerio from 'cheerio';

export interface ProductDetails {
    id?: string;
    name: string;
    description?: string;
    price?: number;
    currency?: string;
    images?: string[];
    url: string;
}

export default class ProductParser {
    origin: string;
    url: string;

    constructor(url: string) {
        const { origin } = new URL(url);
        this.origin = origin;
        this.url = url;
    }

    /**
     * Fetches the product page HTML.
     */
    private async fetchPage(): Promise<string> {
        const response = await fetch(this.url);
        return await response.text();
    }

    /**
     * Main parse method that loads the page and routes to a brand-specific parser.
     */
    public async parse(): Promise<ProductDetails | null> {
        try {
            const html = await this.fetchPage();
            const $ = cheerio.load(html);

            if (this.origin.includes('myntra.com')) {
                return this.parseMyntra($);
            } if (this.origin.includes('hm.com')) {
                return this.parseHM($);
            } if (this.origin.includes('nykaa.com')) {
                return this.parseNykaa($);
            } if (this.origin.includes('snitch.com')) {
                return this.parseSnitch($);
            } if (this.origin.includes('ajio.com')) {
                this.parseAjio($);
            }
            return this.parseGeneric($);

        } catch (error) {
            console.error('Error in parsing product page:', error);
            return null;
        }
    }

    /**
     * Parses a Myntra product page.
     */
    private parseMyntra($: cheerio.CheerioAPI): ProductDetails | null {
        // Attempt to parse JSON-LD structured data for product info
        const jsonLdScript = $('script[type="application/ld+json"]')
            .filter((_i, el) => {
                const json = $(el).html();
                return json ? json.includes('"@type": "Product"') : false;
            })
            .first()
            .html();

        if (jsonLdScript) {
            try {
                const productData = JSON.parse(jsonLdScript);
                const product: ProductDetails = {
                    id: productData.sku,
                    name: productData.name,
                    description: productData.description,
                    price: productData.offers ? Number.parseFloat(productData.offers.price) : undefined,
                    currency: productData.offers ? productData.offers.priceCurrency : undefined,
                    images: Array.isArray(productData.image) ? productData.image : [productData.image],
                    url: this.url,
                };
                return product;
            } catch (error) {
                console.error('Myntra JSON-LD parsing error:', error);
            }
        }
        // Fallback to generic parser if JSON-LD fails
        return this.parseGeneric($);
    }

    /**
     * Parses an H&M product page.
     */
    private parseHM($: cheerio.CheerioAPI): ProductDetails | null {
        // Example selectors – update based on actual H&M markup
        const name = $('meta[property="og:title"]').attr('content') || $('title').text().trim();
        const description = $('meta[property="og:description"]').attr('content') || '';
        const priceText = $('meta[property="product:price:amount"]').attr('content');
        const currency = $('meta[property="product:price:currency"]').attr('content');
        const image = $('meta[property="og:image"]').attr('content');

        const product: ProductDetails = {
            name: name || 'Unknown Product',
            description,
            price: priceText ?Number.parseFloat(priceText) : undefined,
            currency,
            images: image ? [image] : [],
            url: this.url,
        };

        return product;
    }

    /**
     * Parses a Nykaa product page.
     */
    private parseNykaa($: cheerio.CheerioAPI): ProductDetails | null {
        // Update these selectors based on Nykaa's page structure
        const name = $('h1.product-title').text().trim();
        const description = $('div.product-description').text().trim();
        const priceText = $('span.product-price').text().trim().replace(/[^\d\.]/g, '');
        const image = $('img.product-main-image').attr('src');

        const product: ProductDetails = {
            name: name || 'Unknown Product',
            description,
            price: priceText ?Number.parseFloat(priceText) : undefined,
            images: image ? [image] : [],
            url: this.url,
        };

        return product;
    }

    /**
     * Parses a Snitch product page.
     */
    private parseSnitch($: cheerio.CheerioAPI): ProductDetails | null {
        // Update these selectors based on Snitch's page structure
        const name = $('h1.product-name').text().trim();
        const description = $('div.product-details').text().trim();
        const priceText = $('span.price').text().trim().replace(/[^\d\.]/g, '');
        const image = $('img.primary-image').attr('src');

        const product: ProductDetails = {
            name: name || 'Unknown Product',
            description,
            price: priceText ?Number.parseFloat(priceText) : undefined,
            images: image ? [image] : [],
            url: this.url,
        };

        return product;
    }

    /**
     * Parses an Ajio product page.
     */
    private parseAjio($: cheerio.CheerioAPI): ProductDetails | null {
        // Update these selectors based on Ajio's page structure
        const name = $('meta[property="og:title"]').attr('content') || $('title').text().trim();
        const description = $('meta[property="og:description"]').attr('content') || '';
        const priceText = $('meta[property="product:price:amount"]').attr('content');
        const currency = $('meta[property="product:price:currency"]').attr('content');
        const image = $('meta[property="og:image"]').attr('content');

        const product: ProductDetails = {
            name: name || 'Unknown Product',
            description,
            price: priceText ? Number.parseFloat(priceText) : undefined,
            currency,
            images: image ? [image] : [],
            url: this.url,
        };

        return product;
    }

    /**
     * Fallback generic parser that attempts to extract common meta tags.
     */
    private parseGeneric($: cheerio.CheerioAPI): ProductDetails | null {
        const name = $('meta[property="og:title"]').attr('content') || $('title').text().trim();
        const description =
            $('meta[property="og:description"]').attr('content') ||
            $('meta[name="description"]').attr('content') ||
            '';
        const priceText = $('meta[property="product:price:amount"]').attr('content');
        const currency = $('meta[property="product:price:currency"]').attr('content');
        const image = $('meta[property="og:image"]').attr('content');

        const product: ProductDetails = {
            name: name || 'Unknown Product',
            description,
            price: priceText ?Number.parseFloat(priceText) : undefined,
            currency,
            images: image ? [image] : [],
            url: this.url,
        };

        return product;
    }
}
