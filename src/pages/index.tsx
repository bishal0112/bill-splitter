import Head from "next/head";
import { initialFriends } from "../data/dummyData";
import { useState } from "react";

export default function Home() {
  const [friends, setFriends] = useState(initialFriends);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedFriend, setSelectedFriend] = useState<any>(null);

  const handleButtonClick = () => {
    setIsOpen((isOpen) => !isOpen);
  };

  const handleAddFriend = (friend: any) => {
    setFriends((friends) => [...friends, friend]);
    setIsOpen(false);
  };

  const handleSelection = (friend: any) => {
    setSelectedFriend((cur: any) => (cur?.id === friend.id ? null : friend));
    setIsOpen(false);
  };

  const handleSplitBill = (value: any) => {
    console.log(value);

    setFriends((friends: any) =>
      friends.map((friend: any) =>
        friend.id === selectedFriend.id
          ? { ...friend, balance: friend.balance + value }
          : friend
      )
    );
    setSelectedFriend(null);
  };

  return (
    <>
      <Head>
        <title>Bill Splitter</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="header">
        <h1>Bill Splitter</h1>
      </div>
      <div>
        <div>
          <FormAddFriend onAddFriend={handleAddFriend} />
        </div>
        <div className="sidebar">
          <FriendsList
            friends={friends}
            selectedFriend={selectedFriend}
            onSelection={handleSelection}
          />
          {selectedFriend && (
            <FormSplitBill
              selectedFriend={selectedFriend}
              onSplitBill={handleSplitBill}
              key={selectedFriend.id}
            />
          )}
        </div>
      </div>
    </>
  );
}

const FriendsList = ({ friends, onSelection, selectedFriend }: any) => {
  return (
    <ul>
      {friends.map((friend: any) => (
        <Friend
          friend={friend}
          key={friend.id}
          onSelection={onSelection}
          selectedFriend={selectedFriend}
        />
      ))}
    </ul>
  );
};

const Friend = ({ friend, onSelection, selectedFriend }: any) => {
  const isSelected = selectedFriend?.id === friend.id;

  return (
    <li className={isSelected ? "selected" : ""}>
      <img src={friend.image} alt={friend.name} />
      <h3> {friend.name}</h3>
      {friend.balance < 0 && (
        <p className="red">
          You owe {friend.name} Rs.{Math.abs(friend.balance)}
        </p>
      )}
      {friend.balance > 0 && (
        <p className="green">
          {friend.name} owes you Rs.{Math.abs(friend.balance)}
        </p>
      )}
      {friend.balance === 0 && <p>You and {friend.name} are even</p>}
      <Button onClick={() => onSelection(friend)}>
        {isSelected ? "Close" : "Select"}
      </Button>
    </li>
  );
};

const Button = ({ children, onClick }: any) => {
  return (
    <button className="button" onClick={onClick}>
      {children}
    </button>
  );
};

const initialValues = {
  friendName: "",
  imgURL: "https://i.pravatar.cc/48?u=499476",
};

const FormAddFriend = ({ onAddFriend }: any) => {
  const [values, setValues] = useState<any>(initialValues);

  const handleAddFriend = (event: any) => {
    const { name, value }: any = event.target;
    setValues({ ...values, [name]: value });
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();

    if (!values.friendName || !values.imgURL) return;

    const id = crypto.randomUUID();

    const newFriend = {
      id,
      name: values.friendName,
      image: `${values.imgURL}?id={id}`,
      balance: 0,
    };
    onAddFriend(newFriend);

    setValues(initialValues);
  };

  return (
    <form className="form-add-friend" onSubmit={handleSubmit}>
      <label>🧍Friend name</label>
      <input
        type="text"
        name="friendName"
        value={values.friendName}
        onChange={handleAddFriend}
      />

      <label>🌅Image URL</label>
      <input
        type="text"
        name="imgURL"
        value={values.imgURL}
        onChange={handleAddFriend}
      />
      <Button>Add</Button>
    </form>
  );
};

const FormSplitBill = ({ selectedFriend, onSplitBill }: any) => {
  const [bill, setBill] = useState<any>("");
  const [paidByUser, setPaidByUser] = useState<any>("");
  const paidByFriend = bill ? bill - paidByUser : "";
  const [whoIsPaying, setWhoIsPaying] = useState("user");

  const handleSubmit = (e: any) => {
    e.preventDefault();

    if (!bill || !paidByUser) return;
    console.log(whoIsPaying);

    onSplitBill(whoIsPaying === "user" ? paidByFriend : -paidByUser);
  };

  return (
    <form className="form-split-bill" onSubmit={handleSubmit}>
      <h2>Split a bill with {selectedFriend.name}</h2>
      <label>💰 Bill Value</label>
      <input
        type="text"
        value={bill}
        onChange={(e: any) => setBill(Number(e.target.value))}
      />
      <label>🧍 Your expense</label>
      <input
        type="text"
        value={paidByUser}
        onChange={(e: any) =>
          setPaidByUser(
            Number(e.target.value) > bill ? paidByUser : Number(e.target.value)
          )
        }
      />
      <label>🧑‍🤝‍🧑 {selectedFriend.name}&apos;s expense</label>
      <input type="text" disabled value={paidByFriend} />
      <label>🤑 Who is paying the bill</label>
      <select
        value={whoIsPaying}
        onChange={(e: any) => setWhoIsPaying(e.target.value)}
      >
        <option value="user">You</option>
        <option value="friend">{selectedFriend.name}</option>
      </select>
      <Button>Split bill</Button>
    </form>
  );
};
