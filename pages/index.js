import WrongNetworkMessage from "../components/WrongNetworkMessage";
import ConnectWalletButton from "../components/ConnectWalletButton";
import TodoList from "../components/TodoList";
import { TaskContractAddress } from "../config.js";
import TaskAbi from "../components/contracts/TaskContract.json";
import {ethers}  from "ethers";
import { useEffect, useState } from "react";

/* 
const tasks = [
  { id: 0, taskText: 'clean', isDeleted: false }, 
  { id: 1, taskText: 'food', isDeleted: false }, 
  { id: 2, taskText: 'water', isDeleted: true }
]
*/

export default function Home() {
  const [correctNetwork, setCorrectNetwork] = useState(false);
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);
  const [currentAccount, setCurrentAccount] = useState("");
  const [tasks, setTasks] = useState([]);
  const [input, setInput] = useState("");

  useEffect(() => {
    (async () => {
      await connectWallet();
      await getAllTasks();
    })();
  }, []);
  // Calls Metamask to connect wallet on clicking Connect Wallet button
  const connectWallet = async () => {
    try {
      const { ethereum } = window;
      if (!ethereum) {
        console.log("Metamask not Detected");
        return;
      }
      let chainId = await ethereum.request({ method: "eth_chainId" });
      const dapps = "0x1f91";
      if (chainId !== dapps) {
        alert("you are not connected to Shardeum Dapps network");
        setCorrectNetwork(false);
        return;
      } else {
        setCorrectNetwork(true);
      }

      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });
      console.log("Accounts Found", accounts[0]);
      setIsUserLoggedIn(true);
      setCurrentAccount(accounts[0]);
    } catch (e) {
      console.error(e);
    }
  };

  // Just gets all the tasks from the contract
  const getAllTasks = async () => {
    try {
      const { ethereum } = window;
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const TaskContract = new ethers.Contract(
          TaskContractAddress,
          TaskAbi.abi,
          signer
        );
        let allTasks = await TaskContract.getMyTasks();
        setTasks(allTasks);
      } else {
        console.log("Ethereum Object does not exist");
      }
    } catch (error) {
      console.log(error);
    }
  };

  // Add tasks from front-end onto the blockchain
  const addTask = async (e) => {
    // e.preventDefault();
    let task = {
      taskText: input,
      isDeleted: false,
    };

    try {
      const { ethereum } = window;
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const TaskContract = new ethers.Contract(
          TaskContractAddress,
          TaskAbi.abi,
          signer
        );
        TaskContract.addTask(task.taskText, task.isDeleted)
          .then((res) => {
            setTasks([...tasks, task]);
            console.log("Added Task");
            setInput("");
          })
          .catch((err) => {
            console.log(err);
          });
      } else {
        console.log("Ethereum Object does not exist");
      }
    } catch (error) {
      console.log(error);
    }
  };

  // Remove tasks from front-end by filtering it out on our "back-end" / blockchain smart contract
  const deleteTask = (key) => async () => {
    try {
      const { ethereum } = window;
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const TaskContract = new ethers.Contract(
          TaskContractAddress,
          TaskAbi.abi,
          signer
        );
        const deleteTx = await TaskContract.deleteTask(key, true);
        console.log("Task deleted successfully", deleteTx);
        setTimeout(async () => {
          let allTasks = await TaskContract.getMyTasks();
          setTasks(allTasks);
          console.log(allTasks);
        }, 5500);
      } else {
        console.log("Ethereum Object does not exist");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="bg-[#97b5fe] h-screen w-screen flex justify-center py-6">
      {!isUserLoggedIn ? (
        <ConnectWalletButton connectWallet={connectWallet} />
      ) : correctNetwork ? (
        <TodoList
          input={input}
          setInput={setInput}
          addTask={addTask}
          account={currentAccount}
          tasks={tasks}
          deleteTask={deleteTask}
        />
      ) : (
        <WrongNetworkMessage />
      )}
    </div>
  );
}
