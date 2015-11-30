---
layout: default
title: WiX チュートリアル 日本語訳 Lesson 2 ユーザー・インタフェイス / 5. チェーンの新しい環
chapter: ch02
current: ch02-05
prev: 04-do-you-speak-english
prev-title: 4. 英語はわかりますか
next: 06-think-localized
next-title: 4. 地域化を考える
origin: /user-interface/new-link-in-the-chain/
---
# Lesson 2 ユーザー・インタフェイス

## 5. チェーンの新しい環

WixUI インタフェイス・ライブラリは、通常のセットアップ・シナリオのほとんどを扱うことが出来ますが、
ときには修正や追加が必要になることもあります。
そういう場合に対処するためには、[WiX ソース・コード](http://wix.codeplex.com/SourceControl/list/changesets)
もダウンロードしなければなりません。
と言うのは、いくつかのソース・ファイルを覗き見する必要があるからです。

サンプル [SampleWixUIAddDlg](https://www.firegiant.com/system/files/samples/SampleWixUIAddDlg.zip) では、
*WixUI_Mondo*  ライブラリを修正して、ユーザーに登録情報(名前、組織、シリアル番号)を入力してもらうダイアログを追加します。
新しいダイアログは、「使用許諾契約」ダイアログと「セットアップ・タイプ」ダイアログの間に出現します。

>  訳註：SampleWixUIAddDlg の日本語版は [Sample-2-5-WixUIAddDlg.zip](/samples/Sample-2-5-WixUIAddDlg.zip) です。

これを実現するためには、この新しいダイアログを記述する **UserRegistrationDlg.wxs** という新しいファイルを提供しなければなりません。
既存のダイアログから始めて、それを修正しても構いませんし、一から自分で書いても構いません。
[後のレッスン](/ch08/index.html) で、ダイアログの作成方法と、WiX のさまざまなインタフェイス要素の使い方を説明しますが、
ここでは、いくつかの注意点を述べるにとどめます。

{% highlight xml %}
<?xml version='1.0' encoding='utf-8'?>
<Wix xmlns='http://schemas.microsoft.com/wix/2006/wi'>
{% endhighlight %}

新しいダイアログは独立した断片(fragment)として記述しなければなりません。

{% highlight xml %}
  <Fragment>
    <UI>
      <Dialog Id="UserRegistrationDlg"
          Width="370" Height="270"
          Title="[ProductName] [Setup]" NoMinimize="yes">
        <Control Id="NameLabel" Type="Text"
            X="45" Y="73" Width="100" Height="15"
            TabSkip="no" Text="ユーザー名(&amp;U):" />
        <Control Id="NameEdit" Type="Edit"
            X="45" Y="85" Width="220" Height="18"
            Property="USERNAME" Text="{80}" />
        <Control Id="OrganizationLabel" Type="Text"
            X="45" Y="110" Width="100" Height="15"
            TabSkip="no" Text="会社名(&amp;O):" />
        <Control Id="OrganizationEdit" Type="Edit"
            X="45" Y="122" Width="220" Height="18"
            Property="COMPANYNAME" Text="{80}" />
        <Control Id="CDKeyLabel" Type="Text"
            X="45" Y="147" Width="50" Height="10"
            TabSkip="no">
          <Text>CD キー(&amp;K)</Text>
        </Control>
        <Control Id="CDKeyEdit" Type="MaskedEdit"
            X="45" Y="159" Width="250" Height="16"
            Property="PIDKEY" Text="[PIDTemplate]" />
{% endhighlight %}

このダイアログが、元の一連のダイアログの中に挿入されます。
このダイアログに先行するダイアログと後続するダイアログを指定しなければなりません。
先行するのは「使用許諾契約」、後続するのは「セットアップ・タイプ」です。
*WixUI_Mondo* のソース・ファイル、ダウンロードしたソース・パッケージの `src\ext\UIExtension\wixlib\WixUI_Mondo.wxs` を見ると、
これらのダイアログの実際の識別子を知ることが出来ます。
名前は、*LicenseAgreementDlg* と *SetupTypeDlg* です。
従って、この新しいダイアログから、これら前後のダイアログを参照するように、以下のように記述します。

{% highlight xml %}
        <Control Id="Back" Type="PushButton"
            X="180" Y="243" Width="56" Height="17"
            Text="戻る(&amp;B)">
          <Publish Event="NewDialog"
              Value="LicenseAgreementDlg">1</Publish>
        </Control>
        <Control Id="Next" Type="PushButton"
            X="236" Y="243" Width="56" Height="17"
            Default="yes" Text="次へ(&amp;N)">
          <Publish Event="ValidateProductID"
              Value="0">1</Publish>
          <Publish Event="SpawnWaitDialog"
              Value="WaitForCostingDlg">CostingComplete = 1</Publish>
          <Publish Event="NewDialog"
              Value="SetupTypeDlg">ProductID</Publish>
        </Control>
        <Control Id="Cancel" Type="PushButton"
            X="304" Y="243" Width="56" Height="17"
            Cancel="yes" Text="キャンセル">
          <Publish Event="SpawnDialog"
              Value="CancelDlg">1</Publish>
        </Control>
        <Control Id="BannerBitmap" Type="Bitmap"
            X="0" Y="0" Width="370" Height="44"
            TabSkip="no" Text="WixUI_Bmp_Banner" />
        <Control Id="Description" Type="Text"
            X="25" Y="23" Width="280" Height="15"
            Transparent="yes" NoPrefix="yes">
          <Text>あなたのユーザー情報を入力して下さい。</Text>
        </Control>
        <Control Id="BottomLine" Type="Line"
            X="0" Y="234" Width="370" Height="0" />
        <Control Id="Title" Type="Text"
            X="15" Y="6" Width="200" Height="15"
            Transparent="yes" NoPrefix="yes">
          <Text>{\WixUI_Font_Title}ユーザー情報</Text>
        </Control>
        <Control Id="BannerLine" Type="Line"
            X="0" Y="44" Width="370" Height="0" />
      </Dialog>
    </UI>
  </Fragment>
</Wix>
{% endhighlight %}

新しいダイアログを元のユーザー・インタフェイスに組み込むことはかなり簡単です。
前にやったように単純に *WixUI_Mondo* を参照する代りに、**UI** タグで私たち自身のインタフェイスを作成します。
と言っても、*WixUI_Mondo* の大部分は依然として使いたい訳ですから、
まず最初に **UIRef** を使って *WixUI_Mondo* を呼び出してから、修正部分を追加します。
最初に、新しい *UserRegistrationDlg* ダイアログを参照します。

次に、残っている二つのリンクを定義しなければなりません。
元の WixUI_Mondo では、「使用許諾契約」ダイアログは「セットアップ・タイプ」ダイアログを後続するものとして指し示していました。
その逆も同様です。今や新しいダイアログが両者の間に挿入されている訳ですから、
元のダイアログの *「次へ」* および *「戻る」* のリンクをそれに合わせて修正しなければなりません。
簡単な方法は、**WixUI_Mondo.wxs** から関連する **Publish** タグをコピーしてきて、他は何も変えずに、
**Value** 属性を修正して新しいダイアログを指し示すようにする、という方法です。

{% highlight xml %}
    <UI Id="MyWixUI_Mondo">
      <UIRef Id="WixUI_Mondo" />
      <UIRef Id="WixUI_ErrorProgressText" />

      <DialogRef Id="UserRegistrationDlg" />

      <Publish Dialog="LicenseAgreementDlg" Control="Next"
          Event="NewDialog" Value="UserRegistrationDlg" Order="3">
        LicenseAccepted = "1"
      </Publish>
      <Publish Dialog="SetupTypeDlg" Control="Back"
          Event="NewDialog" Value="UserRegistrationDlg">
        1
      </Publish>
    </UI>
{% endhighlight %}

メインのソース・ファイルは、私たちが参照したプロパティを定義しなければなりません。
マスク・エディット・コントロールは、[いろんな文字](https://msdn.microsoft.com/en-us/library/aa369797.aspx)
を使って、どんな内容がどのようにコントロールに表示されるか、どんな種類の入力をコントロールが受け入れるか、そして、
データを受け取るプロパティに割り当てられる最終的なデータがどのような書式で整形されるか、という事を決定します。

{% highlight xml %}
    <Property Id="PIDTemplate">
        <![CDATA[12345<### ###>@@@@@]]>
    </Property>
{% endhighlight %}

これで全てです。これで、修正されたインストーラを下記のコマンドによってビルドすることが出来ます。

{% highlight bat %}
candle.exe SampleWixUIAddDlg.wxs UserRegistrationDlg.wxs
light.exe -ext WixUIExtension -out SampleWixUIAddDlg.msi
      SampleWixUIAddDlg.wixobj UserRegistrationDlg.wixobj
{% endhighlight %}
