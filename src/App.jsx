import { ethers } from "ethers";

export default function App() {
  // ① コントラクトアドレス（Remixでデプロイしたものをここに入れます）
  // ※必ずご自身のアドレス（0x...）に書き換えてください
  const contractAddress = "0x026E9ff58e7e0335c5d1f9a704FFc682a757905E";
  
  // ② ABI（コントラクトの関数の形）
  const abi = ["function buyCertificate(string memory uri) public payable"];

  // ③ 購入処理
  const handlePurchase = async () => {
    if (!window.ethereum) {
      alert("MetaMaskをインストールしてください！");
      return;
    }

    try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const contract = new ethers.Contract(contractAddress, abi, signer);

        // テスト用の車両データURI
        const testUri = "https://ipfs.io/ipfs/QmNoZdyQqiCPA3uwhnXdHja3693hVZ9FYZTbVeYRW31i1J";

        // ★修正ポイント：Polygon Amoyの最低要件（25Gwei）をクリアするための設定を追加
        const tx = await contract.buyCertificate(testUri, {
            value: ethers.parseEther("0.01"),
            maxPriorityFeePerGas: ethers.parseUnits("30", "gwei"),
            maxFeePerGas: ethers.parseUnits("40", "gwei")
        });

        alert("トランザクション送信中！MetaMaskの完了を待ってください。");
        
        // トランザクションのマイニング（ブロックチェーンへの書き込み）完了を待機
        await tx.wait();
        alert("購入完了！");

    } catch (error) {
        if (error.code === "ACTION_REJECTED" || error.code === 4001) {
            alert("キャンセルされました。");
        } else {
            console.error("エラー詳細:", error);
            alert("エラーが発生しました。");
        }
    }
  };

  // ④ 画面の見た目
  return (
    <div style={{ padding: "50px", textAlign: "center", fontFamily: "sans-serif" }}>
      <h1>中古車両 NFTマーケット</h1>
      
      <div style={{ border: "1px solid #ccc", padding: "20px", margin: "20px auto", maxWidth: "300px", borderRadius: "8px" }}>
        <h2>トヨタ プリウス 2020年式</h2>
        <p>車台番号: ABC-123456</p>
        <p style={{ fontWeight: "bold", fontSize: "1.2em" }}>価格: 0.01 MATIC</p>
        <button 
          onClick={handlePurchase} 
          style={{ 
            padding: "12px 24px", 
            fontSize: "16px", 
            fontWeight: "bold",
            cursor: "pointer", 
            backgroundColor: "#007bff", 
            color: "white", 
            border: "none", 
            borderRadius: "5px",
            width: "100%",
            marginTop: "10px"
          }}
        >
          購入する
        </button>
      </div>
    </div>
  );
}