

const HOST = process.env.NEXT_PUBLIC_APP_URL;

export function generateUniqueLink(spaceName: string, ownerUniqueName: string) {
    if (!spaceName || !ownerUniqueName) {
        return null;
    }
    ownerUniqueName = ownerUniqueName.trim().toLowerCase().replace(/[^a-zA-Z0-9_-]/g, '');
    spaceName = spaceName.trim().toLowerCase().replace(/[^a-zA-Z0-9_-]/g, '');

    ownerUniqueName = ownerUniqueName.replace(/[^a-z0-9]/g, '-');
    spaceName = spaceName.replace(/[^a-z0-9]/g, '-');

    return `${HOST}/${ownerUniqueName}/${spaceName}`;

}