// Map a checklist item (row) to one or more spaces (string tags split by `|` in JSON).
export function getItemSpaces(row) {
    return (row.Spaces || '').split('|').map(s => s.trim()).filter(Boolean);
}

// For UI: canonical list of spaces you expect in buildings
export const SPACES_MASTER = [
    'Entrance', 
    'Lobby', 
    'Reception Desks', 
    'Work Floor', 
    'Kitchenette (Work Floor)',
    'Meeting Room', 
    'Event Spaces', 
    'Gym/Fitness', 
    'Retail',
    'Restrooms', 
    'Wellness/Lactation',
    'Sensory Rooms', 
    'Prayer Rooms', 
    'Corridors & Circulation', 
    'Elevators/Stairs',
    'Exterior & Paths', 
    'Parking/Loading', 
    'Security/Access Control', 
    'IT/AV & Kiosks',
    'Café/Dining', 
    'Service Animal Relief Area'
];

// Build a dict: { spaceName: [items...] }
export function groupItemsBySpace(items) {
    const bucket = {};
    items.forEach(it => {
        const tags = getItemSpaces(it);
        if (tags.length === 0) tags.push('Work Floor');
        tags.forEach(tag => {
            bucket[tag] = bucket[tag] || [];
            bucket[tag].push(it);
        });
    });
    return bucket;
}
