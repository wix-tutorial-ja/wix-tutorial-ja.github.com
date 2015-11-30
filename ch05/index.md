---
layout: default
title: WiX チュートリアル 日本語訳 Lesson 5 Net と .NET
chapter: ch05
current: ch05
prev: /ch04/05-mergers
prev-title: 5. 融合するもの
next: 01-framed-by-net
next-title: 1. .NET の枠組み
origin: /net-and-net/
---
#  Lesson 5 Net と .NET

.NET Framework に基づいたプログラムを配布しようとする場合、ユーザーがフレームワークをインストール済みであることを確かめなければなりません。
Microsoft はフレームワークの再頒布を許可していますが、再頒布は元の形式に限るとしています
(Microsoft による説明 [Redistributing the .NET Framework](https://msdn.microsoft.com/en-us/library/xak0tsbd(v=vs.90).aspx) を参照して下さい)。

> 訳註：上記記事の日本語版は [.NET Framework の再頒布](https://msdn.microsoft.com/ja-jp/library/xak0tsbd(v=vs.90).aspx) です。

このことは、フレームワークを自分自身の .msi パッケージに組み込むことは出来ない、ということも意味しています。
マージ・モジュールやそれに類するものは手に入りません。
独立したブートストラップ・インストーラを提供する必要があります。
ブートストラップ・インストーラ(Steup.exe)は、フレームワークがインストールされているかどうかを調べて、
再頒布用の Dotnetfx.exe を起動します
(あるいは、別の方法としては、ネットからダウンロードしてインストールします)。
そして、.NET Framework のインストールが完了した後で、あなた自身のインストーラ・パッケージを呼び出すようにするのです。

しかし、そのようなブートストラップ・インストーラを自分で書く必要はありません。
WiX 3.6 以降では、付属するブートストラッパーである  Burn を使って .NET framework をインストールすることが出来ます。
( [How To: Install the .NET Framework Using Burn](http://wixtoolset.org/documentation/manual/v3/howtos/redistributables_and_install_checks/install_dotnet.html) )

> 訳注：無料でオープン・ソースのブートストラッパー、dotNetInstaller を使うことも可能です。
> dotNetInstaller に関しては、[http://cml.s10.xrea.com/](http://cml.s10.xrea.com/) の「和訳文書」中にユーザーズ・ガイドの日本語訳があります。