# Upstream Sync Guide

This document outlines the process for syncing with the upstream `react-native-calendars` repository.

## Overview

This fork maintains compatibility with the original `react-native-calendars` v1 API while adding Vietnamese lunar calendar functionality. Since v3 the source tree is TypeScript throughout, so upstream JavaScript changes are ported by hand rather than merged. When the upstream repository releases updates, we need to carefully merge those changes while preserving our lunar calendar features.

## Sync Process

### 1. Monitor Upstream

- Watch the [upstream repository](https://github.com/wix/react-native-calendars)
- Check for new releases and updates
- Review changelog and breaking changes

### 2. Prepare for Sync

```bash
# Add upstream remote if not already added
git remote add upstream https://github.com/wix/react-native-calendars.git

# Fetch latest changes
git fetch upstream

# Check what's new
git log HEAD..upstream/master --oneline
```

### 3. Evaluate Changes

Before merging, evaluate:

- **New Features**: Are they compatible with lunar calendar functionality?
- **Bug Fixes**: Do they affect lunar date calculations?
- **Breaking Changes**: How do they impact our lunar features?
- **Dependencies**: Any new dependencies that might conflict?

### 4. Merge Strategy

#### For Minor Updates (Bug Fixes)
```bash
# Create a sync branch
git checkout -b sync/upstream-minor

# Merge upstream changes
git merge upstream/master

# Resolve conflicts if any
# Test lunar calendar functionality
# Update version and changelog
```

#### For Major Updates (New Features)
```bash
# Create a sync branch
git checkout -b sync/upstream-major

# Merge upstream changes
git merge upstream/master

# Review and adapt lunar calendar code
# Update lunar date calculations if needed
# Test thoroughly
```

### 5. Conflict Resolution

Common conflict areas:

- **Calendar Components**: Ensure lunar date display is preserved
- **Date Utilities**: Lunar date calculations must remain intact
- **Styling**: Lunar date styling should not be overridden
- **Tests**: Lunar calendar tests must pass

### 6. Testing Checklist

After sync:

- [ ] All original calendar features work
- [ ] Lunar calendar displays correctly
- [ ] Lunar date calculations are accurate
- [ ] All tests pass
- [ ] No regression in lunar features
- [ ] Performance is maintained

### 7. Update Documentation

- Update version numbers
- Update changelog
- Update compatibility notes
- Update migration guide if needed

### 8. Release Process

```bash
# Update version in package.json
# Update CHANGELOG.md
# Commit changes
git commit -m "Sync with upstream vX.X.X"

# Create release
git tag v2.X.X
git push origin v2.X.X

# Publish to npm
npm publish
```

## Lunar Calendar Preservation

### Critical Files to Preserve

- `src/calendar/day/multi-period/index.js` - Lunar date calculations
- Lunar date constants and algorithms
- Lunar date display logic
- Lunar calendar tests

### Integration Points

- Calendar day rendering
- Date marking systems
- Theme customization
- Event handling

## Version Mapping

| Upstream Version | Our Version | Notes |
|------------------|-------------|-------|
| v1.x.x | v2.x.x | Base compatibility |
| v2.x.x | v3.x.x | Major updates |

## Emergency Rollback

If a sync causes issues:

```bash
# Revert to previous working version
git revert <sync-commit-hash>

# Or reset to previous tag
git reset --hard v2.X.X

# Force push if necessary
git push --force-with-lease origin main
```

## Communication

- Update issue templates for upstream-related issues
- Document any breaking changes
- Communicate sync status to users
- Provide migration guides if needed

## Resources

- [Upstream Repository](https://github.com/wix/react-native-calendars)
- [Upstream Issues](https://github.com/wix/react-native-calendars/issues)
- [Upstream Releases](https://github.com/wix/react-native-calendars/releases)
