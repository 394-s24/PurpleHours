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
    const helpCount = await getUserHelpCountsSingle(uid, course);

    // Generate a new entry with a unique key based on a timestamp
    const newEntryRef = push(
      ref(db, `queues/${course}/groups/` + groupId + "/names/"),
    );

    await updateHelpCountersIfNeeded(uid, displayName, course);

    // Set the data for this entry
    await set(newEntryRef, {
      name: displayName,
      uid: uid,
      helpCount: helpCount,
    });

    setInGroupStatus(uid, course, true); // Update user status to indicate they are in a group

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

      setInGroupStatus(uid, course, false); // Update user status to indicate they are not in a group

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
    const groupRef = ref(db, `queues/${course}/groups/${id}`);
    const namesRef = ref(db, `queues/${course}/groups/${id}/names/`);
    
    // Fetch the group's data
    const snapshot = await get(groupRef);

    if (snapshot.exists()) {
      let groupData = snapshot.val();

      // Remove the currentlyHelping field from the data
      delete groupData.currentlyHelping;

      const members = Object.values(groupData.names);

      // Set inGroup status to false for all members
      for (const member of members) {
        await setInGroupStatus(member.uid, course, false);
      }

      // Save the modified group data (without currentlyHelping) to the history field under the course
      const historyRef = ref(db, `courses/${course}/history/${id}`);
      await set(historyRef, groupData);

      console.log("Group data saved to history successfully!");
    }

    // Remove the group from the active queue
    await remove(groupRef);

    console.log("Group removed from active queue successfully!");
  } catch (error) {
    console.error("The removal failed...", error);
  }
}

export async function removeGroupAndIncrement(course, id) {
  try {
    const groupRef = ref(db, `queues/${course}/groups/${id}`);
    
    // Fetch the group data
    const snapshot = await get(groupRef);
    const group = snapshot.val();

    if (!group || !group.names) {
      console.error("Group or names not found, skipping updates.");
      return;
    }

    // Remove the currentlyHelping field from the data
    delete group.currentlyHelping;

    const names = group.names;

    // Update help counters for all users in the group concurrently
    const updatePromises = Object.keys(names).map(async (uid) => {
      try {
        await updateHelpCountersIfNeeded(names[uid].uid, names[uid].name, course);
        incrementHelpCounters(names[uid].uid, course);
        setInGroupStatus(names[uid].uid, course, false);
      } catch (error) {
        console.error(`Failed to update counters for user ${uid}:`, error);
      }
    });

    // Wait for all counter updates to complete
    await Promise.all(updatePromises);

    // Save the modified group data (without currentlyHelping) to the history field under the course
    const historyRef = ref(db, `courses/${course}/history/${id}`);
    await set(historyRef, group);

    console.log("Group data saved to history successfully!");

    // Remove the group from the active queue
    await remove(groupRef);

    console.log("Group removed from active queue successfully!");
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