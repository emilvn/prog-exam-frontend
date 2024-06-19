function formatPrice(price: number): string {
    return Intl.NumberFormat("da-DK", {
        style: "currency",
        currency: "DKK"
    }).format(price);
}

export { formatPrice };
