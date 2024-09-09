import {
  getDatabase,
  ref,
  set,
  get,
  push,
  remove,
  update,
} from "firebase/database";

import {
  setInGroupStatus,
  getUserHelpCountsSingle,
  updateHelpCountersIfNeeded,
  incrementHelpCounters,
} from "./UserFuncs";

import app from "./FirebaseApp";

const db = getDatabase(app);

export async function createNewGroup(course, groupsData) {
  // Reference to the location where you want to save the data
  const groupRef = ref(db, `queues/${course}/groups/`);

  try {
    let groupID = await push(groupRef, groupsData);
    let key = groupID.key;

    await update(ref(db, `queues/${course}/groups/${key}`), {
      id: key, // Assuming you want to save the key as an `id` field inside the pushed object
    });

    console.log("Data saved successfully!");
    return key;
  } catch (error) {
    console.error("The write failed...", error);
    return null;
  }
}

export async function addToGroup(course, groupId, displayName, uid) {
  try {
    const helpCount = await getUserHelpCountsSingle(uid);

    // Generate a new entry with a unique key based on a timestamp
    const newEntryRef = push(
      ref(db, `queues/${course}/groups/` + groupId + "/names/"),
    );

    await updateHelpCountersIfNeeded(uid, displayName);

    // Set the data for this entry
    await set(newEntryRef, {
      name: displayName,
      uid: uid,
      helpCount: helpCount,
    });

    setInGroupStatus(uid, true); // Update user status to indicate they are in a group

    console.log("Data added successfully in order!");
  } catch (error) {
    console.error("The update failed...", error);
    return null;
  }
}

export async function removeFromGroup(course, uid, groupId) {
  try {
    const removeRef = ref(db, `queues/${course}/groups/` + groupId);
    const groupRef = ref(db, `queues/${course}/groups/` + groupId + "/names/");
    const snapshot = await get(groupRef);

    if (!snapshot.exists()) {
      console.log("Group does not exist or no names found.");
      return;
    }

    const names = snapshot.val();
    let keyToRemove = null;

    // Find the correct key that matches the uid
    for (const key in names) {
      if (names[key].uid === uid) {
        keyToRemove = key;
        break;
      }
    }

    if (keyToRemove) {
      const nameRef = ref(
        db,
        `queues/${course}/groups/` + groupId + "/names/" + keyToRemove,
      );
      await remove(nameRef);

      setInGroupStatus(uid, false); // Update user status to indicate they are not in a group

      console.log("User removed successfully!");

      // Check if the group is now empty and remove the group if it is
      const updatedSnapshot = await get(groupRef);
      if (
        !updatedSnapshot.exists() ||
        Object.keys(updatedSnapshot.val()).length === 0
      ) {
        await remove(removeRef);
      }
    } else {
      console.log("User not found in the group.");
    }
  } catch (error) {
    console.error("The removal failed...", error);
  }
}

export async function removeGroup(course, id) {
  try {
    const namesRef = ref(db, `queues/${course}/groups/` + id + "/names/");
    const snapshot = await get(namesRef);

    if (snapshot.exists()) {
      const members = Object.values(snapshot.val());
      for (const member of members) {
        setInGroupStatus(member.uid, false);
      }
    }

    const groupRef = ref(db, `queues/${course}/groups/` + id);
    await remove(groupRef);

    console.log("Group removed successfully!");
  } catch (error) {
    console.error("The removal failed...", error);
  }
}

export async function removeGroupAndIncrement(course, id) {
  try {
    const groupRef = ref(db, `queues/${course}/groups/` + id);

    // Fetch group data
    const snapshot = await get(groupRef);
    const group = snapshot.val();

    if (!group || !group.names) {
      console.error("Group or names not found, skipping updates.");
      return;
    }

    const names = group.names;

    // Update help counters for all users in the group concurrently
    const updatePromises = Object.keys(names).map(async (uid) => {
      try {
        await updateHelpCountersIfNeeded(names[uid].uid, names[uid].name);
        incrementHelpCounters(names[uid].uid);
        setInGroupStatus(names[uid].uid, false);
      } catch (error) {
        console.error(`Failed to update counters for user ${uid}:`, error);
      }
    });

    // Wait for all counter updates to complete
    await Promise.all(updatePromises);

    // Remove the group after all updates are completed
    await remove(groupRef);
    console.log("Group removed successfully!");
  } catch (error) {
    console.error("Failed to remove group or update counters:", error);
  }
}

export async function setGroupHelping(course, groupId, user) {
  const groupRef = ref(db, `queues/${course}/groups/` + groupId);

  try {
    // Update the group to indicate the user is helping
    await update(groupRef, {
      currentlyHelping: true,
      helper: { name: user.displayName, uid: user.uid },
    });

    console.log("Data updated successfully!");
  } catch (error) {
    console.error("The update failed...", error);
  }
}

export async function putBackGroup(course, groupId) {
  const groupRef = ref(db, `queues/${course}/groups/` + groupId);

  try {
    // Update the group to indicate the user is no longer helping
    await update(groupRef, {
      currentlyHelping: false,
      helper: null,
    });

    console.log("Data updated successfully!");
  } catch (error) {
    console.error("The update failed...", error);
  }
}