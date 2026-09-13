import { Product, Coupon, Order, SupportAdmin } from '../types';

export interface BotResponse {
  text: string;
  suggestedActions?: { label: string; action: string; payload?: any }[];
  productSuggestions?: Product[];
}

export function generateFastAIResponse(
  userQuery: string,
  context: {
    products: Product[];
    coupons: Coupon[];
    orders: Order[];
    supportAdmins: SupportAdmin[];
    userName?: string;
  }
): BotResponse {
  const query = userQuery.toLowerCase().trim();
  const { products, coupons, orders, supportAdmins, userName = 'Dəyərli Müştərimiz' } = context;

  // 1. Live Support / Admin Request
  if (
    query.includes('canlı') ||
    query.includes('admin') ||
    query.includes('operator') ||
    query.includes('insan') ||
    query.includes('əməkdaş') ||
    query.includes('nümayəndə') ||
    query.includes('məsləhətçi') ||
    query.includes('əlaqə saxla') ||
    query.includes('canli') ||
    query.includes('danışmaq istəyirəm') ||
    query.includes('operatora bağla')
  ) {
    const onlineAdmins = supportAdmins.filter((a) => a.isActive && a.status === 'online');
    return {
      text: `Hörmətli ${userName}, sizi məmnuniyyətlə Canlı Dəstək operatorlarımıza yönləndirirəm. Hazırda sistemdə ${
        onlineAdmins.length > 0 ? `${onlineAdmins.length} aktiv operatorumuz online` : 'dəstək mütəxəssislərimiz'
      } rejimdədir. Bir toxunuşla canlı söhbətə başlaya bilərsiniz.`,
      suggestedActions: [
        { label: '🟢 Canlı Dəstəyə Keç', action: 'open_live_support' },
        { label: '📦 Sifarişlərim', action: 'go_to_orders' },
        { label: '⚡ Flaş Endirimlər', action: 'go_to_flash_sales' }
      ]
    };
  }

  // 2. Orders & Tracking
  if (
    query.includes('sifariş') ||
    query.includes('sifaris') ||
    query.includes('kargo') ||
    query.includes('izlə') ||
    query.includes('haradadır') ||
    query.includes('status') ||
    query.includes('hardadır') ||
    query.includes('kuryer')
  ) {
    if (orders.length > 0) {
      const latestOrder = orders[0];
      return {
        text: `Sizin son sifarişiniz: #${latestOrder.orderNumber}. Məbləğ: ${(latestOrder.total ?? 0).toFixed(2)} AZN. Status: ${
          latestOrder.status === 'delivered'
            ? '✅ Çatdırıldı'
            : latestOrder.status === 'on_the_way'
            ? '🚚 Kuryer yoldadır'
            : latestOrder.status === 'preparing'
            ? '📦 Hazırlanır'
            : '⏳ Emal olunur'
        }.\n\nBütün sifarişlərinizin dəqiq marşrutunu və kuryer statusunu "Sifarişlərim" bölməsindən addım-addım izləyə bilərsiniz.`,
        suggestedActions: [
          { label: '📦 Sifarişlərimi İzlə', action: 'go_to_orders' },
          { label: '💬 Operatorla Dəqiqləşdir', action: 'open_live_support' }
        ]
      };
    } else {
      return {
        text: `Sizin hazırda aktiv sifarişiniz görünmür. Bəyəndiyiniz məhsulları səbətə əlavə edərək cəmi 1 dəqiqə ərzində rahatlıqla sifariş rəsmiləşdirə bilərsiniz. Sifariş verildikdən sonra real-vaxt izləmə xəritəsi aktivləşir.`,
        suggestedActions: [
          { label: '🛍️ Alış-verişə Başla', action: 'go_to_home' },
          { label: '⚡ Flaş Təkliflər', action: 'go_to_flash_sales' }
        ]
      };
    }
  }

  // 3. Delivery / Çatdırılma
  if (
    query.includes('çatdırılma') ||
    query.includes('catdirilma') ||
    query.includes('pulsuz çatdırılma') ||
    query.includes('kuryer') ||
    query.includes('rayon') ||
    query.includes('bakı') ||
    query.includes('neçə günə') ||
    query.includes('nece gune') ||
    query.includes('vaxta gəlir')
  ) {
    return {
      text: `🚚 **MMZ ONLINE Çatdırılma Qaydaları:**\n• **Pulsuz Çatdırılma:** 35 AZN və yuxarı bütün sifarişlər üçün çatdırılma tamamilə PULSUZDUR!\n• **Bakı daxili:** Standart kuryer 1-2 iş günü, Təcili Ekspress kuryer isə cəmi 2 saat ərzində çatdırır.\n• **Bütün Regionlar & Rayonlar:** Azərbaycanın istənilən bölgəsinə sürətli poçt/kuryer vasitəsilə 2-3 günə təhvil verilir.`,
      suggestedActions: [
        { label: '🛍️ Məhsullara Bax', action: 'go_to_home' },
        { label: '💬 Canlı Dəstəyə Yaz', action: 'open_live_support' }
      ]
    };
  }

  // 4. Payment / Ödəniş & BirKart
  if (
    query.includes('ödəniş') ||
    query.includes('odenis') ||
    query.includes('birkart') ||
    query.includes('taksit') ||
    query.includes('kart') ||
    query.includes('nağd') ||
    query.includes('nagd') ||
    query.includes('balans') ||
    query.includes('kredit')
  ) {
    return {
      text: `💳 **Ödəniş Üsulları:**\n1. **Qapıda Nağd və ya POS-terminal:** Məhsulu təhvil alarkən nağd və ya kartla ödəyə bilərsiniz.\n2. **BirKart Taksit:** Bütün məhsulları 2, 3, 6 və ya 12 aylıq faizsiz taksitlə əldə edə bilərsiniz.\n3. **Bank Kartı Online:** Visa & MasterCard ilə 3D Secure güvənli ödəniş.\n4. **MMZ Wallet & Coins:** Topladığınız keşbek və bonusları ödəniş zamanı endirim kimi istifadə edə bilərsiniz.`,
      suggestedActions: [
        { label: '🏷️ Endirimli Məhsullar', action: 'go_to_flash_sales' },
        { label: '💳 Səbətə Keç', action: 'go_to_cart' },
        { label: '💬 Ödəniş Üzrə Məsləhət', action: 'open_live_support' }
      ]
    };
  }

  // 5. Coupons & Promo codes
  if (
    query.includes('kupon') ||
    query.includes('promokod') ||
    query.includes('kod') ||
    query.includes('promo') ||
    query.includes('endirim kodu') ||
    query.includes('mmz2026')
  ) {
    const activeCoupons = coupons.filter((c) => c.isActive);
    const couponCodes = activeCoupons.map((c) => `• **${c.code}**: ${c.description || `${c.discountValue}% endirim`}`).join('\n');
    return {
      text: `🎁 **Aktiv Endirim Kuponlarımız:**\n${couponCodes || '• **MMZ2026**: 20% xüsusi endirim!'}\n\nKuponu Səbət və ya Ödəniş səhifəsində daxil edərək dərhal endirim əldə edə bilərsiniz!`,
      suggestedActions: [
        { label: '🛒 Səbətdə Kuponu Yoxla', action: 'go_to_cart' },
        { label: '⚡ Flaş Satışlar', action: 'go_to_flash_sales' }
      ]
    };
  }

  // 6. Returns & Quality / Qaytarma və Keyfiyyət
  if (
    query.includes('qaytar') ||
    query.includes('dəyiş') ||
    query.includes('deyis') ||
    query.includes('xarab') ||
    query.includes('orijinal') ||
    query.includes('keyfiyyət')
  ) {
    return {
      text: `🔄 **Geri Qaytarma və Keyfiyyət Standartı:**\n• **Qaytarma Şərtləri:** Məhsulun ilkin əmtəə görünüşü, qutusu və qəbzi saxlanıldığı halda qaytarma və ya dəyişdirmə müraciəti edə bilərsiniz.\n• **Orijinallıq:** Satılan hər bir məhsul birbaşa istehsalçı sertifikatı ilə gəlir.`,
      suggestedActions: [
        { label: '💬 Dəstək Mütəxəssisinə Yaz', action: 'open_live_support' },
        { label: '🛍️ Məhsullara Bax', action: 'go_to_home' }
      ]
    };
  }

  // 7. Product specific searches & recommendations
  // Search in product titles, categories, tags
  const matchedProducts = products.filter((p) => {
    const titleMatch = p.title.toLowerCase().includes(query);
    const catMatch = p.category.toLowerCase().includes(query);
    const descMatch = p.description.toLowerCase().includes(query);
    const tagMatch = p.tags.some((t) => t.toLowerCase().includes(query));
    
    // Check keywords
    const keywords = query.split(' ').filter((w) => w.length > 2);
    const anyWord = keywords.some(
      (kw) =>
        p.title.toLowerCase().includes(kw) ||
        p.category.toLowerCase().includes(kw) ||
        p.description.toLowerCase().includes(kw)
    );

    return titleMatch || catMatch || descMatch || tagMatch || anyWord;
  });

  if (matchedProducts.length > 0) {
    const topPicks = matchedProducts.slice(0, 3);
    const productListText = topPicks
      .map(
        (p) =>
          `• **${p.title}** - Qiymət: **${(p.price ?? 0).toFixed(2)} AZN** ${
            (p.oldPrice ?? 0) > (p.price ?? 0) ? `(Əvvəlki: ${(p.oldPrice ?? 0).toFixed(2)} AZN)` : ''
          } ⭐ ${p.rating}`
      )
      .join('\n');

    return {
      text: `Sizin sorğunuza uyğun **${matchedProducts.length} məhsul** tapdım. Ən çox tövsiyə olunanlar:\n\n${productListText}\n\nİstədiyiniz məhsulun üzərinə basaraq detallı baxa və ya dərhal səbətə əlavə edə bilərsiniz.`,
      productSuggestions: topPicks,
      suggestedActions: [
        { label: '🔎 Hamısını Göstər', action: 'search_product', payload: userQuery },
        { label: '💬 Operatorla Dəqiqləşdir', action: 'open_live_support' }
      ]
    };
  }

  // 8. Cheaper / Budget products
  if (query.includes('ucuz') || query.includes('sərfəli') || query.includes('endirimlər') || query.includes('qiymət')) {
    const sortedCheapest = [...products].sort((a, b) => a.price - b.price).slice(0, 3);
    return {
      text: `Hal-hazırda ən sərfəli və endirimli məhsullarımız bunlardır:\n\n${sortedCheapest
        .map((p) => `• **${p.title}** - Cəmi **${(p.price ?? 0).toFixed(2)} AZN**`)
        .join('\n')}\n\nBütün super təklifləri "Flash Satış" bölməsindən də görə bilərsiniz.`,
      productSuggestions: sortedCheapest,
      suggestedActions: [
        { label: '⚡ Flaş Satışlar', action: 'go_to_flash_sales' },
        { label: '💬 Canlı Dəstək', action: 'open_live_support' }
      ]
    };
  }

  // 9. Greetings & Welcome
  if (
    query.includes('salam') ||
    query.includes('hər vaxtınız') ||
    query.includes('sabahınız') ||
    query.includes('axşamınız') ||
    query.includes('necəsiniz') ||
    query.includes('hello') ||
    query.includes('hi')
  ) {
    return {
      text: `Salam ${userName}! 👋 Mən **MMZ Smart AI Dəstək Köməkçisi**yəm. Sizə məhsul seçimi, qiymətlər, 35 AZN-dən pulsuz çatdırılma, kuponlar və sifarişlərinizin izlənməsi ilə bağlı dərhal kömək etməyə hazıram.\n\nSizə bu gün nə ilə kömək edə bilərəm?`,
      suggestedActions: [
        { label: '⚡ Flaş Endirimlər', action: 'go_to_flash_sales' },
        { label: '🎁 Kuponlar', action: 'go_to_cart' },
        { label: '🚚 Çatdırılma Qaydaları', action: 'ask_delivery' },
        { label: '🟢 Canlı Dəstəyə Yaz', action: 'open_live_support' }
      ]
    };
  }

  // 10. General Smart Fallback with clear guidance and Live Support trigger
  return {
    text: `Sualınızı tam başa düşdüm. MMZ ONLINE-da bütün məhsullar 100% orijinaldır, 35 AZN-dən yuxarı çatdırılma pulsuzdur və rahat qaytarma xidməti mövcuddur.\n\nƏgər xüsusi bir məhsul axtarırsınızsa adını yaza bilərsiniz, və ya dərhal real **Canlı Dəstək Mütəxəssisimizlə** danışa bilərsiniz.`,
    suggestedActions: [
      { label: '🟢 Canlı Dəstəyə Yaz', action: 'open_live_support' },
      { label: '⚡ Günün Fürsətləri', action: 'go_to_flash_sales' },
      { label: '📦 Sifarişlərimi Yoxla', action: 'go_to_orders' }
    ]
  };
}
