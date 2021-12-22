package com.koreait.basic.board;

import com.koreait.basic.Utils;
import com.koreait.basic.dao.BoardRankDAO;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

@WebServlet("/board/rank")
public class BoardRankServlet extends HttpServlet {
    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse res) throws ServletException, IOException {
        String type = req.getParameter("type");
        String title = null;
        switch (type) {
            case "1": //조회수 Top 10
                title = "조회수 Top 10";
                req.setAttribute("list", BoardRankDAO.selBoardHitsRankList());
                break;
            case "2":
                title = "댓글수 Top 10";
                req.setAttribute("list", BoardRankDAO.selBoardCmtRankList());
                break;
            case "3":
                title = "좋아요 Top 10";
                req.setAttribute("list", BoardRankDAO.selBoardHeartRankList());
                break;
        }
        Utils.displayView(title, "board/rank", req, res);
    }
}