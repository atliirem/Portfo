type FeatureValues = Record<string, any>;

export const mapStateToFormData = (form: any, featureValues: FeatureValues = {}) => {
  const fd = new FormData();

  console.log("=== mapStateToFormData Debug ===");
  console.log("form.licenceFile:", form.licenceFile);

  fd.append("title", form.title ?? "");

  const typeId = form.selectedSubCategoryId || form.selectedCategoryId;
  fd.append("type_id", String(typeId ?? ""));

  fd.append("country_id", String(form.location.country || ""));
  fd.append("city_id", String(form.location.city || ""));
  fd.append("district_id", String(form.location.district || ""));
  fd.append("street_id", String(form.location.streets || ""));

  const currencyId =
    form.pass.currencyId ||
    form.commission.currencyId ||
    form.price.currencyId ||
    1;

  fd.append("currency_id", String(currencyId));

  const isUnderConstruction =
    form.selectedSubCategoryId === 34 || form.selectedSubCategoryId === 35
      ? "1"
      : "0";
  fd.append("is_under_construction", isUnderConstruction);

  const hasCommission = form.commission.salePrice !== "";
  const hasPass = form.pass.passPrice !== "" || form.pass.salePrice !== "";

  if (hasCommission) {
    fd.append("pricing_type", "COMMISSION");
    fd.append("sell_price", String(form.commission.salePrice));
    fd.append("buyer_commission_rate", String(form.commission.buyerRate || 0));
    fd.append("seller_commission_rate", String(form.commission.sellerRate || 0));
  } else if (hasPass) {
    fd.append("pricing_type", "PASS");
    fd.append("pass_price", String(form.pass.passPrice));
    fd.append("sell_price", String(form.pass.salePrice));
  } else {
    fd.append("pricing_type", "PASS");
    fd.append("pass_price", "0");
    fd.append("sell_price", "0");
  }

  const maxPrice = form.pass.salePrice || form.commission.salePrice || form.price.maxPrice || "0";
  fd.append("max_price", String(maxPrice));

  // Proje bilgileri
  if (form.selectedSubCategoryId === 34 || form.selectedSubCategoryId === 35) {
    fd.append("project_min", String(form.project.min || ""));
    fd.append("project_max", String(form.project.max || ""));
    fd.append("room_count", String(form.project.roomCount || ""));

    // Fiyat seçenekleri
    if (form.project.priceOptions && form.project.priceOptions.length > 0) {
      form.project.priceOptions.forEach((price: string, index: number) => {
        if (price && price.trim() !== "") {
          fd.append(`price_options[${index}]`, String(price));
        }
      });
    }
  }

if (form.licenceFile && form.licenceFile.uri) {
  console.log("Adding licence file to FormData:", form.licenceFile);
  
  fd.append("licence_file", {
    uri: form.licenceFile.uri,
    name: form.licenceFile.name || "licence.pdf",
    type: form.licenceFile.type || "application/pdf",
  } as any);
}
  Object.keys(featureValues).forEach((key) => {
    const value = featureValues[key];

    if (value === "" || value === null || value === undefined) {
      return;
    }

    if (key.includes("_child_")) {
      const childId = key.split("_child_")[1];

      if (typeof value === "object" && value.id) {
        fd.append(`details[${childId}]`, String(value.id));
      } else if (Array.isArray(value)) {
        value.forEach((item, index) => {
          const itemId = typeof item === "object" ? item.id : item;
          fd.append(`details[${childId}][${index}]`, String(itemId));
        });
      } else {
        fd.append(`details[${childId}]`, String(value));
      }
      return;
    }

    const featureId = key;

    if (typeof value === "object" && !Array.isArray(value) && value.id) {
      fd.append(`details[${featureId}]`, String(value.id));
    } else if (Array.isArray(value)) {
      value.forEach((item, index) => {
        const itemId = typeof item === "object" ? item.id : item;
        fd.append(`details[${featureId}][${index}]`, String(itemId));
      });
    } else {
      fd.append(`details[${featureId}]`, String(value));
    }
  });

  return fd;
};