---
layout: default
title: WiX チュートリアル 日本語訳 Lesson 8 ユーザー・インタフェイス再び / 1. 一つだけのダイアログ
chapter: ch08
current: ch08-01
prev: index
prev-title: Lesson 8 ユーザー・インタフェイス再び
next: 02-tuning-up
next-title: 2. チューニング・アップ
origin: /user-interface-revisited/a-single-dialog/
---
# Lesson 8 ユーザー・インタフェイス再び

## 1. 一つだけのダイアログ

![SampleCustomUI1 InstallDlg](/images/customstart.png)

最初は、一つだけの簡単なインタフェイスから始めましょう。
すなわち、タイトルとインストールを開始するボタンしかないダイアログです。

ダイアログは全て一意の識別子を持たなければなりません。
ダイアログのサイズは、私たちが使うウィザードの標準サイズに合せます。
**Title** の意味はそのものずばりですが、ここでも角括弧の表記法を使ってプロパティを参照することが出来ることに注意して下さい。
こうしておくと、新しい製品のインストーラ・パッケージを作成するときに、UI の部分をまるごと編集し直す必要が無くなるので、非常に便利です。
**ProductName** は、ソース・ファイルの一番最初の **Product** タグで定義した製品名を指し示すように、自動的に定義されます。

{% highlight xml %}
<Dialog Id="InstallDlg" Width="370" Height="270"
    Title="[ProductName] [Setup]" NoMinimize="yes">
{% endhighlight %}

ダイアログに追加する全てのものはコントロールになります。
**Type** 属性がコントロールの種類を示します
(コントロールの種類は、*Billboard*, *Bitmap*, *CheckBox*, *ComboBox*, *DirectoryCombo*, *DirectoryList*, *Edit*, *GroupBox*, 
*Icon*, *Line*, *ListBox*, *ListView*, *MaskedEdit*, *PathEdit*, *ProgressBar*, *PushButton*, *RadioButtonGroup*, *ScrollableText*, 
*SelectionTree*, *Text*, *VolumeCostList* または *VolumeSelectCombo* です)。
単純なテキスト (通常の Windows 用語では、スタティック・テキストと呼ばれるもの。
何もせず、クリックしても反応せず、ただそこにあるだけのテキスト)
として、*Text* のタイプを使用します。
そして、位置とサイズを指定します。

タイトル・テキストの要素は、一般的な場合のために、**Transparent** と指定されています。
これらのテキストは上部のバナー・ビットマップの上に重ねられます。
今のところは白い背景に黒で文字が描画されていますので、文字の背景を透明にしても何も違いは生じませんが、
タイトル・テキストの下にまで延びるフルサイズのバナー画像と色の付いたテキストを提供すれば、素敵な視覚効果を生むことが出来るでしょう。
**NoPrefix** は、アンパサンド (`&`) が文字通りに表示されるのか、それとも、Windows の GUI の通例に従って、
ショートカットを指定するものとして使われるのか、ということを制御しているだけです。

{% highlight xml %}
  <Control Id="Title" Type="Text"
      X="15" Y="6" Width="200" Height="15"
      Transparent="yes" NoPrefix="yes">
    <Text>{\DlgTitleFont}インストール準備完了</Text>
  </Control>
{% endhighlight %}

コントロールのテキストを指定するためには二つの方法があります。
コントロールの中で **Text** という子のタグを使うか、または **Text** 属性を使うかです。
    
{% highlight xml %}
  <Control Id="Title" Type="Text"
      X="15" Y="6" Width="200" Height="15"
      Transparent="yes" NoPrefix="yes"
      Text="{\DlgTitleFont}インストール準備完了"/>
{% endhighlight %}

**TextStyle** タグを使ってフォントのスタイルを参照することが出来ます。
また、インストーラはデフォルトのフォントを決めるために **DefaultUIFont** という標準のプロパティを必要としますので、
このプロパティをソースに含めてフォントを関連付けなければなりません。

{% highlight xml %}
  <Property Id="DefaultUIFont">DlgFont8</Property>
  <TextStyle Id="DlgFont8" FaceName="Tahoma" Size="8" />
  <TextStyle Id="DlgTitleFont" FaceName="Tahoma" Size="8" Bold="yes" />
{% endhighlight %}

唯一のアクティブなコントロールはプッシュ・ボタン (タイプは **PushButton**) になります。
ここでも、位置とサイズを指定します。
一つだけのボタンなので、デフォルトのボタンにもします (エンター・キーの押下に反応します)。
ユーザーが操作した時に何かをするアクティブなユーザー・インタフェイス要素は、
操作された時に何をするかを定義する **Publish** タグを内部に入れ子にして持っていなければなりません。
選択できる標準的なイベントは数多くあって、長いリストになります
(EndDialog はその中の一つです)。
ということで、アクションは **Return** という値を持った **EndDialog** にします。
これは、ダイアログを通常の方法で終了し、何もエラーを発生させない、という意味です。

{% highlight xml %}
  <Control Id="Install" Type="PushButton"
      X="304" Y="243" Width="56" Height="17"
      Default="yes" Text="インストール">
    <Publish Event="EndDialog" Value="Return" />
  </Control>
</Dialog>
{% endhighlight %}

ということで、ダイアログが出来ましたが、これを通常のイベント進行の中にスケジュールしなければなりません。
**UI** の終了タグの直前の部分に移動して、下記のような変更を加えます。
管理者インストールについては、今回は考慮しませんので、**AdminUISequence** はクリアします。

**InstallUISequence** については既に言及しましたが、ここで、**InstallExecuteSequence** との相互作用について述べるときが来ました。

標準的なアクションの進行は、真ん中の **InstallValidate** アクションで二つに分かれます。
このアクションは、利用可能なディスク・スペースを検証したり、
インストールによって上書きされるファイルが現在使用中である場合にユーザーに通知したりする役割を持っているものです。
**InstallValidate** とそれ以前のアクションは (さまざまなダイアログ・ボックスを含めて) **InstallUISequence** のリストに含まれ、
一方、このアクションに続くものは **InstallExecuteSequence** に含まれます。
ただし、この規則には、例外があります。
基本 UI モードまたは UI 無しのモードでのインストールにおいては、**InstallUISequence** は参照されませんが、
**InstallExecuteSentence** はこの場合でも単独で動作出来なければなりません。
そのために、**InstallExecuteSequence** は他のテーブルからいくつかのアクションを複製して持っています。
現在のサンプルを Orca でチェックしてみると、**InstallUISequence** には下記のアクションが含まれています。

1. ValidateProductID
2. CostInitialize
3. FileCost
4. CostFinalize
5. ExecuteAction

これらのアクションは、最後の一つを除いて、既に知っているものです。
インストールの際には、両方のテーブルが最初に参照されて、アクションがシーケンス番号の順に実行されます
(複製されたアクションは両方のテーブルで同じ番号を持っていますので、曖昧さは何も生じません)。
**ExecuteAction** は、実際のインストールを開始するのに必要な全ての情報収集が完了した時点にスケジュールされています。
そして、インストールの実行は **InstallExecuteSequence** へと移行して、実際のインストールの過程を受け持つアクションを実行します。

結果として、私たちの一つだけのダイアログ・ボックスは、準備過程の最後のアクションである **CostFinalize** の後、
それでも **ExecuteAction** よりは前、という順位にスケジュールしなければならないことになります。

{% highlight xml %}
    <InstallUISequence>
      <Show Dialog="InstallDlg" After="CostFinalize" />
    </InstallUISequence>
  </UI>
{% endhighlight %}

このサンプル ([SampleCustomeUI](https://www.firegiant.com/system/files/samples/SampleCustomUI.zip)) をビルドして走らせてみて下さい
(カスタム UI のサンプルは 単一のダウンロード・パッケージにまとめられています)。
ダイアログが表示され、「インストール」ボタンを押すと、いつもの三つのファイルがインストールされます。
進捗ダイアログは無く、サイレント・インストールが行われるだけです。
また、インストールのキャンセルは出来ず、開始したら、完了しなくてはなりません。

> 訳註：カスタム UI のサンプルの日本語版は [Sample-8-1-CustomUI.zip](/samples/Sample-8-1-CustomUI.zip) です。

WiX 内蔵の検証プログラムが、標準的なユーザー・インタフェイスの機能がいくつか欠けていることに関して、
ICE 20 の警告を発することに注目して下さい。
カスタム UI のレッスンの始めの方のバージョンは、完全な標準的インタフェイスからは程遠いものですから、
コマンド・ライン・スイッチを使ってそういう警告を抑止しても構わないでしょう。

{% highlight bat %}
candle.exe SampleCustomUI1.wxs
light.exe -sice:ICE20 SampleCustomUI1.wixobj
{% endhighlight %}
