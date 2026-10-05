import { useLiveClasses } from "../hooks/useClasses";

// Plain select over the live classNames list (verified 28 entries, school order).
// Rule: render label, send value (the full name). Never baseName.
export function ClassSelect({ value, onChange, placeholder = "Select Class", portal = "admin", ...rest }) {
    const { names, loading } = useLiveClasses(portal);
    return (
        <select value={value} onChange={(e) => onChange(e.target.value)} disabled={loading} {...rest}>
            <option value="">{placeholder}</option>
            {names.map((name) => (
                <option key={name} value={name}>{name}</option>
            ))}
        </select>
    );
}

// Optgrouped select — base name ("JSS 1") as header, its two sections below.
export function GroupedClassSelect({ value, onChange, placeholder = "Select Class", portal = "admin", ...rest }) {
    const { groups, loading } = useLiveClasses(portal);
    return (
        <select value={value} onChange={(e) => onChange(e.target.value)} disabled={loading} {...rest}>
            <option value="">{placeholder}</option>
            {groups.map((g) => (
                <optgroup key={g.label} label={g.label}>
                    {g.options.map((o) => (
                        <option key={o} value={o}>{o}</option>
                    ))}
                </optgroup>
            ))}
        </select>
    );
}
