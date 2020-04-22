export function formatAddress(address: string): string {
    if (address && address.length > 15)
        return address.substr(0, 6) + '...' + address.substr(address.length - 6, address.length);
    return address;
}