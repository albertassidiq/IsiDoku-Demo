export function formatDate(date: string | Date): string {
    if (!date) return '';
    return new Date(date).toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    });
}
