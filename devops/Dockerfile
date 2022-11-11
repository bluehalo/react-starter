FROM golang

# Update our image
RUN echo "Updating base container" && \
    apt-get -y update && \
    apt-get -y install zip python3 python3-pip vim && \
    apt-get -y upgrade && \
    pip install awscli && \
    apt-get clean && \
    echo "Installing node version manager" && \
    curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.1/install.sh | bash && \
    echo "Installing tfenv" && \
    git clone https://github.com/tfutils/tfenv.git ~/.tfenv && \
    ln -s ~/.tfenv/bin/* /usr/local/bin && \
    echo "Installing tgenv" && \
    git clone https://github.com/cunymatthieu/tgenv.git ~/.tgenv && \
    ln -s ~/.tgenv/bin/* /usr/local/bin && \
    echo "Installing SOPS" && \
    go install go.mozilla.org/sops/v3/cmd/sops@v3.7.3

RUN tfenv install 1.3.3 && \
    tfenv use 1.3.3 && \
    tgenv install 0.39.2 && \
    bash -c "source ~/.bashrc && nvm install 18"

WORKDIR /root/repo